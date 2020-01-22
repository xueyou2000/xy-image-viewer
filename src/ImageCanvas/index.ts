import { imageLoad } from "./utils";
import { DefaultOptions } from "./DefaultValue";
import { CanvasViewOptions } from "./interface";
import { Point, ComplexTransform, Matrix3x3, Mathf } from "../DrawEngine";
import { getDistance, getAngle } from "./utils";

/**
 * Canvas图片操作
 * 注意: Canvas中有默认宽高350x150, 还有默认坐标轴, 左上角为原点, x右边增大, y下方增大. 而不是传统的y上方增大
 * @see https://blog.csdn.net/qq_40556950/article/details/88955205
 */
export default class ImageCanvas {
    /**
     * 画布
     */
    private canvas: HTMLCanvasElement;

    /**
     * 渲染上下文
     */
    private ctx: CanvasRenderingContext2D;

    /**
     * 配置选项
     */
    private options: CanvasViewOptions;

    /**
     * 当前查看图片
     */
    private image: HTMLImageElement;

    /**
     * 动画中操作信息
     */
    private motionCt: ComplexTransform;

    /**
     * 动画完毕操作信息
     */
    private finishCt: ComplexTransform;

    /**
     * 动画计时器句柄
     */
    private timeHandler: number;

    /**
     * 缓存未缩放比例
     */
    private fitScalc: number;

    /**
     * 是否被主动缩放
     * false=未被主动缩放(fit完整包含在画布中, 连点将放大尺寸)
     * true=被主动缩放(此时可以移动图像, 连点将还原尺寸)
     */
    private isScale: boolean;

    /**
     * 构造函数
     * @param canvas
     */
    public constructor(canvas: HTMLCanvasElement, options?: CanvasViewOptions) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.options = Object.assign({}, DefaultOptions, options);
        this.image = null;
        this.motionCt = new ComplexTransform();
        this.finishCt = new ComplexTransform();
        this.fitScalc = 1;
        this.isScale = false;
        this.init();

        (window as any).__imageCanvas = this;
    }

    /**
     * 设置动画完毕图像变换信息
     */
    private setFinishCt(ct: ComplexTransform) {
        const { options, fitScalc } = this;
        const cache = this.finishCt.Copy();
        // 限制缩放比例
        const scale = Mathf.Clamp(ct.GetScale(), options.zoomMin, options.zoomMax);
        ct.SetScale(scale);

        this.isScale = !(scale === fitScalc);

        if (options.onZoom && (!cache || cache.GetScale() !== scale)) {
            options.onZoom(scale, this);
        }

        this.finishCt = ct;
    }

    /**
     * 初始化
     */
    private init() {
        const { options, canvas } = this;
        this.resize();
        if (options.resize) {
            window.addEventListener("resize", this.resize);
        }
        if (options.zoomOnWheel) {
            this.listenerWheel();
        }
        if ("PointerEvent" in window) {
            this.listenerTouch();
        }
        this.listenerMouser();
    }

    /**
     * 加载/切换图片
     * @param src 图片地址
     */
    public loadImage(src: string) {
        const { options } = this;
        if (!src) {
            this.drawTips("暂无图片");
            return Promise.resolve();
        }

        if (options.onStart) {
            options.onStart();
        }

        return imageLoad(src).then((image) => {
            if (options.onLoad) {
                options.onLoad();
            }
            this.image = image;
            const ct = this.getFitCt();
            this.fitScalc = ct.GetScale();
            this.motionCt = ct;
            this.setFinishCt(ct.Copy());
            this.drawImage(ct);
        });
    }

    /**
     * 监听鼠标事件
     */
    private listenerMouser() {
        const { canvas, options } = this;

        let start: Point;
        let ct: ComplexTransform;

        // 鼠标移动图像
        canvas.addEventListener("mousedown", (event) => {
            start = new Point(event.pageX, event.pageY);
            ct = this.finishCt.Copy();
        });
        canvas.addEventListener("mousemove", (event) => {
            if (!start || !this.isScale) {
                return;
            }
            const now = new Point(event.pageX, event.pageY);
            const offset = Point.Subtracts(now, start);
            this.move(ct, offset);
        });
        canvas.addEventListener("mouseup", (event) => {
            start = null;
        });

        // 双击缩小/还原
        canvas.addEventListener("dblclick", () => {
            if (this.isScale) {
                this.fit();
            } else {
                this.natural();
            }
        });
    }

    /**
     * 监听滚轮操作
     */
    private listenerWheel() {
        const { options } = this;
        let wheeling = false;

        this.canvas.addEventListener(
            "wheel",
            (event: WheelEvent) => {
                event.preventDefault();

                // 节流事件, 防止滚动过快
                if (wheeling) {
                    return;
                }
                wheeling = true;
                setTimeout(() => {
                    wheeling = false;
                }, 50);

                // 滚动方向, 取值 -1 或 1
                let delta = 1;
                if (event.deltaY) {
                    delta = event.deltaY > 0 ? 1 : -1;
                } else if ((event as any).wheelDelta) {
                    delta = -(event as any).wheelDelta / 120;
                } else if (event.detail) {
                    delta = event.detail > 0 ? 1 : -1;
                }

                // 绘制图像缩放
                // TODO: 鼠标当前位置, 进行缩放
                const ct = this.finishCt.Copy();
                this.setFinishCt(ct.AddScale(-delta * options.zoomRatio));
                this.doAnimationDraw(40);
                this.motionCt = ct.Copy();
            },
            {
                passive: false,
                capture: true,
            },
        );
    }

    /**
     * 监听手势操作
     */
    private listenerTouch() {
        const { canvas, options } = this;

        // 手势操作类型 0 = 无, 1 = 平移, 2 = 缩放
        let type = 0;
        // 开始触碰点列表
        let start: TouchList;
        // 开始操作时的变换信息
        let ct: ComplexTransform;
        // 缩放双指中心点
        let scaleCenter: Point;

        canvas.addEventListener("touchstart", (evt: TouchEvent) => {
            type = evt.touches.length;
            start = evt.touches;
            ct = this.finishCt.Copy();

            // if (start.length === 2) {
            //     const p1 = start[0];
            //     const p2 = start[1];
            //     const offset = new Point(p1.pageX - p2.pageX, p1.pageY - p2.pageY);

            //     scaleCenter = new Point(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
            //     ct.AddPosition(scaleCenter.x, scaleCenter.y);
            //     console.log("中心点", scaleCenter);
            // }
        });
        canvas.addEventListener("touchmove", (evt: TouchEvent) => {
            evt.preventDefault();
            // 当前触碰点
            const now = evt.touches;

            if (type === 2 && now.length === 2) {
                // 计算缩放比例
                const scale = getDistance(now[0], now[1]) / getDistance(start[0], start[1]);
                // 计算旋转角度
                const angle = getAngle(now[0], now[1]) - getAngle(start[0], start[1]);

                const next = ct.Copy();
                next.SetScale(Mathf.Clamp(next.GetScale() + scale - 1, options.zoomMin, options.zoomMax));
                if (options.gestureRotate) {
                    next.AddAngle(angle);
                }
                this.motionCt = next.Copy();
                this.setFinishCt(next.Copy());
                this.drawImage(next);
            } else if (type === 1 && now.length === 1) {
                const p1 = now[0];
                const p2 = start[0];
                var x = p1.pageX - p2.pageX,
                    y = p1.pageY - p2.pageY;

                this.move(ct, new Point(x, y));
            }
        });
        canvas.addEventListener("touchend", (evt: TouchEvent) => {
            type = 0;
        });
    }

    /**
     * 画布尺寸改变
     */
    private resize = () => {
        const { canvas, options } = this;
        canvas.width = options.width || canvas.clientWidth;
        canvas.height = options.height || canvas.clientHeight;
        this.fit();
    };

    /**
     * 绘制提示文本
     * @param text 提示文本
     */
    public drawTips(text: string) {
        const { canvas, ctx } = this;
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `20px Verdana`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }

    /**
     * 返回画布中心店
     */
    private centerPoint() {
        const { canvas } = this;
        return new Point(canvas.width / 2, canvas.height / 2);
    }

    /**
     * 返回图像中心点
     */
    private imageCenter() {
        const { image } = this;
        if (!image) {
            return new Point();
        }
        return new Point(-image.naturalWidth * 0.5, -image.naturalHeight * 0.5);
    }

    /**
     * 绘制图片并应用变换矩阵
     * @param ct
     */
    public drawImage(ct: ComplexTransform) {
        const { ctx, canvas, image } = this;
        if (!this.exist) {
            return;
        }
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const matrix = ct.UpdateMatrix();
        ctx.setTransform(matrix.m11, matrix.m21, matrix.m12, matrix.m22, matrix.m13, matrix.m23);
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        ctx.restore();
    }

    /**
     * 动画绘制图像
     * @param from 当前变换信息
     * @param to 目标变换信息
     * @param duration 动画时长
     */
    public animationDrawImage(from: ComplexTransform, to: ComplexTransform, duration: number = 300) {
        if (duration <= 0) {
            this.motionCt = to;
            this.finishCt = to;
            this.drawImage(to);
            return;
        }

        const difference = ComplexTransform.Subtracts(to, from);
        const perTick = difference.Divides(duration).Multiplie(10);

        this.timeHandler = window.requestAnimationFrame(() => {
            this.motionCt = ComplexTransform.Adds(from, perTick);
            if (this.motionCt.Equals(to)) return;
            this.drawImage(this.motionCt);
            this.animationDrawImage(this.motionCt, to, duration - 10);
        });
    }

    /**
     * 执行绘图动画
     * @description 从motionCt到finishCt的动画绘制
     */
    private doAnimationDraw(duration: number = 300) {
        if (!this.exist) {
            return;
        }
        // 中断上次未完成的动画
        window.cancelAnimationFrame(this.timeHandler);
        this.animationDrawImage(this.motionCt, this.finishCt, duration);
    }

    /**
     * 是否存在图片
     * @description 存在图片才能操作
     */
    private get exist() {
        return this.image !== null;
    }

    /**
     * 执行适应缩放
     */
    public fit() {
        this.setFinishCt(this.getFitCt());
        this.doAnimationDraw();
    }

    /**
     * 获取适应变换信息
     * @description 图像适应画布, 确保图像完整显示在画布中, 并居中显示
     */
    private getFitCt() {
        const { canvas, image } = this;
        if (!this.exist) {
            return new ComplexTransform();
        }

        // 获取缩放比例
        let scale: number;
        if (image.naturalWidth > image.naturalHeight) {
            // 根据宽度缩放
            scale = Math.min(canvas.width, image.naturalWidth) / image.naturalWidth;
        } else {
            // 根据高度缩放
            scale = Math.min(canvas.height, image.naturalHeight) / image.naturalHeight;
        }

        this.fitScalc = scale;

        const canvasCenter = this.centerPoint();
        const ct = new ComplexTransform();
        ct.SetScale(scale)
            .SetPosition(-image.naturalWidth * 0.5, -image.naturalHeight * 0.5)
            .SetOffset(canvasCenter.x, canvasCenter.y);
        return ct;
    }

    /**
     * 缩放到满屏
     * @description 等比缩放以宽度铺满画布, 并居中显示
     */
    public spread() {
        const { canvas, image } = this;
        if (!this.exist) {
            return;
        }
        const canvasCenter = this.centerPoint();
        const scale: number = canvas.width / image.naturalWidth;
        const ct = new ComplexTransform();
        const center = this.imageCenter();
        ct.SetScale(scale)
            .SetPosition(center.x, center.y)
            .SetOffset(canvasCenter.x, canvasCenter.y);
        this.setFinishCt(ct);
        this.doAnimationDraw();
    }

    /**
     * 缩放到原始尺寸
     */
    public natural() {
        const canvasCenter = this.centerPoint();
        const ct = new ComplexTransform();
        const center = this.imageCenter();
        ct.SetPosition(center.x, center.y).SetOffset(canvasCenter.x, canvasCenter.y);
        this.setFinishCt(ct);
        this.doAnimationDraw();
    }

    /**
     * 旋转当前图像
     * @param angle 累加旋转角度
     */
    public rotate(angle: number) {
        this.finishCt.AddAngle(angle);
        this.doAnimationDraw();
    }

    /**
     * 平移当前图像
     * @param start 起始变换信息
     * @param offset 偏移距离
     */
    private move(start: ComplexTransform, offset: Point) {
        const { isScale } = this;
        if (!isScale) {
            return;
        }

        // TODO 当前图像宽或高, 超出画布, 才允许平移. 平移到边界, 应该不允许再继续平移
        // 确保, 左右, 上下,  不能超出

        const next = start.Copy();
        next.AddOffset(offset.x, offset.y);
        this.motionCt = next.Copy();
        this.setFinishCt(next);
        this.drawImage(next);
    }
}

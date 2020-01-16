import { imageLoad } from "../utils";
import { DefaultOptions } from "./DefaultValue";
import { CanvasViewOptions } from "./interface";
import { Point, ComplexTransform, Matrix3x3 } from "../DrawEngine";

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
     * 当前操作信息
     */
    private motionCt: ComplexTransform;

    /**
     * 动画结果操作信息
     */
    private ct: ComplexTransform;

    /**
     * 动画计时器句柄
     */
    private timeHandler: number;

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
        this.ct = new ComplexTransform();
        this.init();

        (window as any).__imageCanvas = this;
    }

    /**
     * 初始化
     */
    private init() {
        this.resize();
        if (this.options.fullScreen) {
            this.canvas.addEventListener("resize", this.resize);
            // TODO: 监听触摸操作, 双指缩放, 单指平移
        }
    }

    /**
     * 画布尺寸改变
     */
    private resize = () => {
        const { canvas, options } = this;
        canvas.width = options.fullScreen ? window.innerWidth : options.width;
        canvas.height = options.fullScreen ? window.innerHeight : options.height;
        this.fit();
    };

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
            this.motionCt = this.getFitCt();
            this.ct = this.motionCt.Copy();
            this.drawImage(this.ct);
        });
    }

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
     * 返回图片长宽比
     */
    private ratio() {
        const { image } = this;
        return image.naturalWidth / image.naturalHeight;
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
     * 计算中心点
     * @param width 图片缩放后宽度
     * @param height 图片缩放后高度
     */
    private calcCenterPoint(width: number, height: number) {
        const canvasCenter = this.centerPoint();
        return new Point(canvasCenter.x - width / 2, canvasCenter.y - height / 2);
    }

    /**
     * 获取画布中心平移矩阵
     */
    private getCenterMatrix() {
        const center = this.centerPoint();
        return Matrix3x3.Translate(center.x, center.y);
    }

    /**
     * 绘制图片并应用变换矩阵
     * @param ct
     */
    public drawImage(ct: ComplexTransform) {
        const { ctx, canvas, image } = this;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const matrix = ct.UpdateMatrix(this.getCenterMatrix());
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
            this.ct = to;
            this.drawImage(to);
            return;
        }

        const difference = ComplexTransform.Subtracts(to, from);
        const perTick = difference.Divides(duration).Multiplie(10);

        this.timeHandler = window.requestAnimationFrame(() => {
            this.motionCt = ComplexTransform.Adds(from, perTick);
            this.drawImage(this.motionCt);
            this.animationDrawImage(this.motionCt, to, duration - 10);
        });
    }

    /**
     * 执行绘图操作
     * @param ct 变换信息
     */
    private doDraw(ct: ComplexTransform) {
        if (!this.exist) {
            return;
        }
        this.ct = ct;
        // 中断上次未完成的动画
        window.cancelAnimationFrame(this.timeHandler);
        this.animationDrawImage(this.motionCt, this.ct);
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
        this.doDraw(this.getFitCt());
    }

    /**
     * 获取适应变换信息
     * @description 图像适应画布, 确保图像完整显示在画布中, 并居中显示
     */
    private getFitCt() {
        const { canvas, image } = this;
        if (!this.exist) {
            return;
        }

        // 计算画布与图像的差
        const offset: Point = new Point(canvas.width - image.naturalWidth, canvas.height - image.naturalHeight);
        // 获取缩放比例
        let scale: number;
        let width: number, height: number;

        if (Math.abs(offset.x) >= Math.abs(offset.y)) {
            // 根据宽度缩放
            width = Math.min(canvas.width, image.naturalWidth);
            height = width / this.ratio();
            scale = Math.min(canvas.width, image.naturalWidth) / image.naturalWidth;
        } else {
            // 根据高度缩放
            height = Math.min(canvas.height, image.naturalHeight);
            width = height * this.ratio();
            scale = height / image.naturalHeight;
        }

        const ct = new ComplexTransform();
        ct.SetScale(scale);
        ct.SetPosition(-image.naturalWidth * 0.5, -image.naturalHeight * 0.5);
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
        // 获取缩放比例
        const scale: number = canvas.width / image.naturalWidth;
        const ct = new ComplexTransform();
        ct.SetScale(scale);
        const center = this.imageCenter();
        ct.SetPosition(center.x, center.y);
        this.doDraw(ct);
    }

    /**
     * 缩放到原始尺寸
     */
    public natural() {
        const { canvas, image } = this;
        if (!this.exist) {
            return;
        }
        const ct = new ComplexTransform();
        const center = this.imageCenter();
        ct.SetPosition(center.x, center.y);
        this.doDraw(ct);
    }

    /**
     * 缩放图像
     * @param scale 缩放比例
     */
    public zoom(scale: number) {
        const { image, canvas } = this;
        if (!this.exist) {
            return;
        }
        const ct = this.ct.Copy();
        ct.SetScale(scale);

        // 计算缩放后的图片尺寸
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;

        // const center = this.calcCenterPoint(width, height);
        // ct.SetPosition(center.x, center.y);

        const center = this.imageCenter();
        ct.SetPosition(center.x, center.y);

        this.doDraw(ct);
    }

    /**
     * 指定中心点缩放图像
     * @param scale 缩放比例
     * @param point 缩放中心点
     */
    public zoomByPoint(scale: number, point: Point) {
        const { image } = this;
        if (!this.exist) {
            return;
        }
        const ct = this.ct.Copy();
        // ct.SetScale(scale);

        // 为了简单起见, 假设没有缩放
        // 双指的中心点, 应该为

        const center = this.imageCenter();
        ct.SetPosition(center.x, center.y);
        this.doDraw(ct);
    }

    /**
     * 旋转图像
     * @param angle
     */
    public rotate(angle: number) {
        const { image } = this;
        if (!this.exist) {
            return;
        }
        const ct = this.ct.Copy();
        ct.SetAngle(angle);
        const center = this.imageCenter();
        ct.SetPosition(center.x, center.y);
        this.doDraw(ct);
    }
}

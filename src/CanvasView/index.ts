import { imageLoad } from "../utils";
import { DefaultOptions } from "./DefaultOptions";
import { CanvasViewOptions } from "./interface";
import Rect from "./Rect";
import Point from "./Point";

/**
 * Canvas图片操作
 */
export default class CanvasView {
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
     * 当前图片矩形
     */
    private rect: Rect;

    /**
     * 图片变换结果矩形
     */
    private finalRect: Rect;

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
        this.options = Object.assign({}, DefaultOptions, options);
        this.ctx = canvas.getContext("2d");
        this.image = null;
        this.rect = Rect.zero();
        this.finalRect = Rect.zero();
        this.init();

        (window as any).__canvasView = this;
    }

    /**
     * 初始化
     */
    private init() {
        this.resize();
        if (this.options.fullScreen) {
            this.canvas.addEventListener("resize", this.resize);
        }
    }

    /**
     * 画布尺寸改变
     */
    private resize = () => {
        const { canvas, options } = this;
        canvas.width = options.fullScreen ? window.innerWidth : options.width;
        canvas.height = options.fullScreen ? window.innerHeight : options.height;
        this.zoomFit();
    };

    /**
     * 加载/切换图片
     * @param src 图片地址
     */
    public loadImage(src: string) {
        const { canvas, options } = this;

        // TODO 当前图片(如果存在, 则缩小并透明消失, src作为新图片, 放大进入)

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
            this.rect = this.getAppropRect();
            this.finalRect = this.rect;
            this.zoomFit();
        });
    }

    /**
     * 绘制提示文本
     * @param text 提示文本
     */
    public drawTips(text: string) {
        const { canvas, ctx } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `20px Verdana`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    /**
     * 动画绘制图像
     * @param from 当前矩形
     * @param to 目标矩形
     * @param duration 动画时长
     */
    public drawImage = (from: Rect, to: Rect, duration: number = 300) => {
        const { ctx, canvas, image } = this;
        return new Promise((resolve, reject) => {
            const complete = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, to.x, to.y, to.width, to.height);
                this.rect = to;
                window.cancelAnimationFrame(this.timeHandler);
                resolve();
            };

            // 过渡时间结束, 设置为目标终点
            if (duration <= 0) {
                complete();
                return;
            }

            const difference = from.diff(to);
            const perTick = difference.divisionByNum(duration).multipliByNum(10);

            this.timeHandler = window.requestAnimationFrame(() => {
                const current = from.add(perTick);
                this.rect = current;

                if (current.equal(to)) {
                    complete();
                    return;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, current.x, current.y, current.width, current.height);
                this.drawImage(current, to, duration - 10).then(resolve);
            });
        });
    };

    /**
     * 缩放图像
     * @param scale 缩放比率, 范围 0 ~ 1
     * @param point 缩放中心店, 默认为画布中心
     */
    public zoom(scale: number, point: Point = this.centerPoint()) {
        // TODO
    }

    /**
     * 旋转图像
     * @param agnle 旋转角度, 范围 0 ~ 360
     */
    public rotate(agnle: number) {
        // TODO
    }

    /**
     * 缩放以适应画布
     * @description 确保图像完整显示在画布中
     */
    public zoomFit() {
        const { timeHandler, image } = this;
        if (!image) {
            return;
        }
        window.cancelAnimationFrame(this.timeHandler);
        this.finalRect = this.getAppropRect();
        this.drawImage(this.rect, this.finalRect);
    }

    /**
     * 缩放以铺满画布宽度
     * @description 长度可能会溢出画布, 此时是正常的, 请拖拽查看
     */
    public zoomCanvasSize() {
        const { canvas, image, timeHandler } = this;
        if (!image) {
            return;
        }
        window.cancelAnimationFrame(this.timeHandler);
        const width = canvas.width;
        const height = width / this.ratio();
        this.finalRect = this.toRect(width, height);
        this.drawImage(this.rect, this.finalRect);
    }

    /**
     * 缩放到原始图片尺寸
     * @description 长宽都可能溢出画布, 此时是正常的, 请拖拽查看
     */
    public zoomOriginalSize() {
        const { image, timeHandler } = this;
        if (!image) {
            return;
        }

        window.cancelAnimationFrame(this.timeHandler);
        this.finalRect = this.toRect(image.naturalWidth, image.naturalHeight);
        this.drawImage(this.rect, this.finalRect);
    }

    /**
     * 水平翻转
     */
    public flipX() {
        const { ctx, canvas, image } = this;
        ctx.save();
        ctx.scale(-1, 1);
        this.finalRect.x = -this.finalRect.x - this.finalRect.width;

        this.drawImage(this.rect, this.finalRect).then(() => {
            ctx.restore();
        });
    }

    /**
     * 垂直翻转
     */
    public flipY() {
        const { ctx, canvas, image } = this;
        ctx.save();
        ctx.scale(1, -1);
        this.finalRect.y = -this.finalRect.y - this.finalRect.height;

        this.drawImage(this.rect, this.finalRect).then(() => {
            ctx.restore();
        });
    }

    /**
     * 获取容纳矩形
     * @description 图像被完整显示在画布中
     */
    private getAppropRect() {
        const { canvas, image } = this;
        const offset: Point = new Point(canvas.width - image.naturalWidth, canvas.height - image.naturalHeight);
        let width: number, height: number;

        if (Math.abs(offset.x) >= Math.abs(offset.y)) {
            // 根据宽度缩放
            width = Math.min(canvas.width, image.naturalWidth);
            height = width / this.ratio();
        } else {
            // 根据高度缩放
            height = Math.min(canvas.height, image.naturalHeight);
            width = height * this.ratio();
        }
        return this.toRect(width, height);
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
     * 转矩形
     * @description
     * @param width 宽度
     * @param height 高度
     */
    private toRect(width: number, height: number) {
        const { canvas } = this;
        // 确保图片画布在居中摆放
        return new Rect(canvas.width / 2 - width / 2, canvas.height / 2 - height / 2, width, height);
    }
}

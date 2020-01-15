import { imageLoad } from "../utils";
import { DefaultOptions } from "./DefaultValue";
import { CanvasViewOptions } from "./interface";
import Rect from "./Rect";
import Point from "./Point";
import Matrix3x3 from "./Matrix3x3";

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
     * 当前图片矩阵
     */
    private motionMatrix: Matrix3x3;

    /**
     * 动画结果图片矩阵
     */
    private matrix: Matrix3x3;

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
        this.motionMatrix = Matrix3x3.identity();
        this.matrix = Matrix3x3.identity();
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
        this.toFit();
    };

    /**
     * 加载/切换图片
     * @param src 图片地址
     */
    public loadImage(src: string) {
        const { canvas, options } = this;

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
            this.motionMatrix = this.fit();
            this.matrix = this.fit();
            this.drawImage(this.matrix);
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
     * 绘制图片并应用矩阵
     * @param matrix
     */
    public drawImage(matrix: Matrix3x3) {
        const { ctx, canvas, image } = this;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(matrix.m11, matrix.m21, matrix.m12, matrix.m22, matrix.m13, matrix.m23);
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        ctx.restore();
    }

    /**
     * 动画绘制图像
     * @param from 当前矩阵
     * @param to 目标矩阵
     * @param duration 动画时长
     */
    public animationDrawImage(from: Matrix3x3, to: Matrix3x3, duration: number = 300) {
        if (duration <= 0) {
            this.motionMatrix = to;
            this.drawImage(to);
            return;
        }

        const difference = to.sub(from);
        const perTick = difference.divisionByNum(duration).multipliByNum(10);

        this.timeHandler = window.requestAnimationFrame(() => {
            this.motionMatrix = from.add(perTick);
            this.drawImage(this.motionMatrix);
            this.animationDrawImage(this.motionMatrix, to, duration - 10);
        });
    }

    /**
     * 执行绘图操作
     * @param matrix
     */
    private doDraw(matrix: Matrix3x3) {
        if (!this.exist) {
            return;
        }
        // 中断上次未完成的动画
        window.cancelAnimationFrame(this.timeHandler);
        this.matrix = matrix;
        this.animationDrawImage(this.motionMatrix, this.matrix);
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
    public toFit() {
        this.doDraw(this.fit());
    }

    /**
     * 获取适应矩阵
     * @description 图像适应画布, 确保图像完整显示在画布中, 并居中显示
     */
    private fit() {
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

        // 缩放和平移操作映射到矩阵
        let matrix: Matrix3x3 = Matrix3x3.identity();
        // 平移操作, 图像居中在画布
        matrix = matrix.multipli(matrix.copy().translation(canvas.width / 2 - width / 2, canvas.height / 2 - height / 2));
        // 缩放操作
        matrix = matrix.multipli(matrix.copy().scale(scale, scale));
        return matrix;
    }

    /**
     * 执行满屏缩放
     */
    public toSpread() {
        this.doDraw(this.spread());
    }

    /**
     * 获取铺满画布矩阵
     * @description 等比缩放以宽度铺满画布, 并居中显示
     */
    private spread() {
        const { canvas, image } = this;
        if (!this.exist) {
            return;
        }

        // 获取缩放比例
        const scale: number = canvas.width / image.naturalWidth;
        const height = canvas.width / this.ratio();
        // 缩放和平移操作映射到矩阵
        let matrix: Matrix3x3 = Matrix3x3.identity();
        // 缩放操作
        matrix = matrix.multipli(matrix.copy().scale(scale, scale));
        return matrix;
    }

    /**
     * 执行缩放到原始尺寸
     */
    public toNatural() {
        this.doDraw(this.natural());
    }

    /**
     * 获取原始尺寸矩阵
     * @description 不进行缩放, 仅仅平移到画布中心
     */
    private natural() {
        const { canvas, image } = this;
        if (!this.exist) {
            return;
        }

        // 缩放和平移操作映射到矩阵
        let matrix: Matrix3x3 = Matrix3x3.identity();
        // 平移操作, 图像居中在画布
        matrix = matrix.multipli(matrix.copy().translation(canvas.width / 2 - image.naturalWidth / 2, 0));
        return matrix;
    }

    /**
     * 缩放图像
     * @param scale 缩放比率, 范围 0 ~ 1
     * @param point 缩放中心店, 默认为画布中心
     */
    private zoom(scale: number, point: Point = this.centerPoint()) {}

    /**
     * 旋转图像
     * 当前矩阵 * 缩放矩阵 * 旋转矩阵 * 平移矩阵 * 刚才我说的那个平移矩阵
     * @description 注意: 根据当前矩阵变换计算, 也就是说 rotate(45) 之后, 想还原就是 rotate(-45) 而不是 rotate(0)
     * @param agnle 旋转角度, 范围 0 ~ 360
     */
    public rotate(agnle: number) {
        const r = Matrix3x3.identity().rotation(agnle);
        const t = Matrix3x3.identity().translation(this.centerPoint().x, this.centerPoint().y);
        const offset = Matrix3x3.identity().translation(-this.image.naturalWidth * 0.5, -this.image.naturalHeight * 0.5);

        this.doDraw(
            this.matrix
                .multipli(r)
                .multipli(t)
                .multipli(offset),
        );
    }

    /**
     * 水平翻转
     */
    public flipX() {}

    /**
     * 垂直翻转
     */
    public flipY() {}
}

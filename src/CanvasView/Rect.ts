/**
 * 矩形
 */
export default class Rect {
    /**
     * x坐标
     */
    public x: number;

    /**
     * y坐标
     */
    public y: number;

    /**
     * 宽度
     */
    public width: number;

    /**
     * 高度
     */
    public height: number;

    /**
     * 构造函数
     * @param x
     * @param y
     * @param width
     * @param height
     */
    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * 计算与另一个矩形的偏差
     * @param other 目标矩形
     */
    public diff(other: Rect) {
        const { x, y, width, height } = this;
        return new Rect(other.x - x, other.y - y, other.width - width, other.height - height);
    }

    /**
     * 加法运算
     * @param rect 被加数
     */
    public add(rect: Rect) {
        const { x, y, width, height } = this;
        return new Rect(x + rect.x, y + rect.y, width + rect.width, height + rect.height);
    }

    /**
     * 乘法运算
     * @param num 被乘数
     */
    public multipliByNum(num: number) {
        const { x, y, width, height } = this;
        return new Rect(x * num, y * num, width * num, height * num);
    }

    /**
     * 除法运算
     * @param num 被除数
     */
    public divisionByNum(num: number) {
        const { x, y, width, height } = this;
        return new Rect(x / num, y / num, width / num, height / num);
    }

    /**
     * 矩形是否相等
     * @param rect
     */
    public equal(rect: Rect) {
        const { x, y, width, height } = this;
        return rect.x === x && rect.y === y && rect.width === width && rect.height === height;
    }

    /**
     * 所有属性为零的矩形
     */
    public static zero() {
        return new Rect();
    }
}

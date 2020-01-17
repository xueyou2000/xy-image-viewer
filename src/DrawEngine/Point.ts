/**
 * 点
 */
export default class Point {
    /**
     * x坐标
     */
    public x: number;

    /**
     * y坐标
     */
    public y: number;

    /**
     * 构造函数
     * @param x
     * @param y
     */
    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * 点加法
     * @param a
     * @param b
     */
    public static Adds(a: Point, b: Point) {
        return new Point(a.x + b.x, a.y + b.y);
    }

    /**
     * 点减法
     * @param a
     * @param b
     */
    public static Subtracts(a: Point, b: Point) {
        return new Point(a.x - b.x, a.y - b.y);
    }
}

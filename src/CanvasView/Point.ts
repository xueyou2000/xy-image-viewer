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
}

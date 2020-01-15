import Vector3 from "./Vector3";

/**
 * 3x3矩阵, 在canvas中
 * 	[a, c, e]
M = [b, d, f]
	[0, 0, 1]
 */
export default class Matrix3x3 {
    /**
     * 行1列1
     */
    public m11: number = 1;
    /**
     * 行1列2
     */
    public m12: number = 0;
    /**
     * 行1列3
     */
    public m13: number = 0;
    /**
     * 行2列1
     */
    public m21: number = 0;
    /**
     * 行2列2
     */
    public m22: number = 1;
    /**
     * 行2列3
     */
    public m23: number = 0;
    /**
     * 行3列1
     */
    public m31: number = 0;
    /**
     * 行3列2
     */
    public m32: number = 0;
    /**
     * 行3列3
     */
    public m33: number = 1;

    /**
     * 单位化矩阵
     */
    public static identity() {
        const matrix: Matrix3x3 = new Matrix3x3();
        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        // =======
        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        // =======
        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        return matrix;
    }

    /**
     * 平移矩阵
     * @param x 水平方向偏移
     * @param y 垂直方向偏移
     */
    public translation(x: number, y: number) {
        this.m11 = 1.0;
        this.m12 = 0.0;
        this.m13 = x;
        // =======
        this.m21 = 0.0;
        this.m22 = 1.0;
        this.m23 = y;
        // =======
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1.0;

        return this;
    }

    /**
     * 旋转矩阵
     * @param angle 旋转角度
     */
    public rotation(angle: number) {
        this.m11 = Math.cos(angle * (Math.PI / 180));
        this.m12 = -Math.sin(angle * (Math.PI / 180));
        this.m13 = 0.0;
        // =======
        this.m21 = Math.sin(angle * (Math.PI / 180));
        this.m22 = Math.cos(angle * (Math.PI / 180));
        this.m23 = 0.0;
        // =======
        this.m31 = 0.0;
        this.m32 = 0.0;
        this.m33 = 1.0;

        return this;
    }

    /**
     * 缩放矩阵
     * @param x x缩放比例
     * @param y y缩放比例
     */
    public scale(x: number, y: number) {
        this.m11 = x;
        this.m12 = 0.0;
        this.m13 = 0.0;
        // =======
        this.m21 = 0.0;
        this.m22 = y;
        this.m23 = 0.0;
        // =======
        this.m31 = 0.0;
        this.m32 = 0.0;
        this.m33 = 1.0;

        return this;
    }

    /**
     * 矩阵乘法
     * @param other 另一个矩阵
     */
    public multipli(other: Matrix3x3) {
        const m = new Matrix3x3();

        m.m11 = this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31;
        m.m12 = this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32;
        m.m13 = this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33;

        m.m21 = this.m21 * other.m11 + this.m22 * other.m21 + this.m23 * other.m31;
        m.m22 = this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32;
        m.m23 = this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33;

        m.m31 = this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31;
        m.m32 = this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32;
        m.m33 = this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33;

        return m;
    }

    /**
     * 矩阵加法
     * @param other 被加矩形
     */
    public add(other: Matrix3x3) {
        const m = new Matrix3x3();

        m.m11 = this.m11 + other.m11;
        m.m12 = this.m12 + other.m12;
        m.m13 = this.m13 + other.m13;

        m.m21 = this.m21 + other.m21;
        m.m22 = this.m22 + other.m22;
        m.m23 = this.m23 + other.m23;

        m.m31 = this.m31 + other.m31;
        m.m32 = this.m32 + other.m32;
        m.m33 = this.m33 + other.m33;

        return m;
    }

    /**
     * 矩阵减法
     * @param other 被减矩阵
     */
    public sub(other: Matrix3x3) {
        const m = new Matrix3x3();

        m.m11 = this.m11 - other.m11;
        m.m12 = this.m12 - other.m12;
        m.m13 = this.m13 - other.m13;

        m.m21 = this.m21 - other.m21;
        m.m22 = this.m22 - other.m22;
        m.m23 = this.m23 - other.m23;

        m.m31 = this.m31 - other.m31;
        m.m32 = this.m32 - other.m32;
        m.m33 = this.m33 - other.m33;

        return m;
    }

    /**
     * 矩阵乘法
     * @param num 被乘数
     */
    public multipliByNum(num: number) {
        const m = new Matrix3x3();

        m.m11 = this.m11 * num;
        m.m12 = this.m12 * num;
        m.m13 = this.m13 * num;

        m.m21 = this.m21 * num;
        m.m22 = this.m22 * num;
        m.m23 = this.m23 * num;

        m.m31 = this.m31 * num;
        m.m32 = this.m32 * num;
        m.m33 = this.m33 * num;
        return m;
    }

    /**
     * 矩阵除法
     * @param num 被除数
     */
    public divisionByNum(num: number) {
        const m = new Matrix3x3();

        m.m11 = this.m11 / num;
        m.m12 = this.m12 / num;
        m.m13 = this.m13 / num;

        m.m21 = this.m21 / num;
        m.m22 = this.m22 / num;
        m.m23 = this.m23 / num;

        m.m31 = this.m31 / num;
        m.m32 = this.m32 / num;
        m.m33 = this.m33 / num;
        return m;
    }

    /**
     * 矩阵与向量相乘
     * @param v
     */
    public multipliVector(v: Vector3) {
        const vector3: Vector3 = Vector3.zero();

        vector3.x = this.m11 * v.x + this.m21 * v.y + this.m31 * v.z;
        vector3.y = this.m12 * v.x + this.m22 * v.y + this.m32 * v.z;
        vector3.z = this.m13 * v.x + this.m23 * v.y + this.m33 * v.z;

        return vector3;
    }

    /**
     * 拷贝矩阵
     */
    public copy() {
        const matrix: Matrix3x3 = new Matrix3x3();
        matrix.m11 = this.m11;
        matrix.m12 = this.m12;
        matrix.m13 = this.m13;
        // =======
        matrix.m21 = this.m21;
        matrix.m22 = this.m22;
        matrix.m23 = this.m23;
        // =======
        matrix.m31 = this.m31;
        matrix.m32 = this.m32;
        matrix.m33 = this.m33;
        return matrix;
    }

    public toString() {
        const { m11, m12, m13, m21, m22, m23, m31, m32, m33 } = this;

        return `    [${m11.toFixed(2)},\t\t\t${m12.toFixed(2)},\t\t\t${m13.toFixed(2)}]
M = [${m21.toFixed(2)},\t\t\t${m22.toFixed(2)},\t\t\t${m23.toFixed(2)}]
    [${m31.toFixed(2)},\t\t\t${m32.toFixed(2)},\t\t\t${m33.toFixed(2)}]`;
    }
}

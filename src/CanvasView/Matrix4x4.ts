import Vector3 from "./Vector3";

/**
 * 4x4矩阵
 * @description 3维空间的平移,旋转变换需要用4维矩阵表示
 * 因为对于一个平移变化,我们会对于x,y,z增加一个常数.在1*3的矩阵内我们只能表示表示出一个三维空间的点的坐标.用这个矩阵乘一个3*3的矩阵只能得到变化下的点关于x,y,z三个值所表达的坐标.
因此我们需要用一个1*4的矩阵表示x,y,z,1,通过讲这个矩阵乘一个4*4的矩阵这样才能得到平移所对应的新点的坐标.
 */
export default class Matrix4x4 {
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
     * 行1列4
     */
    public m14: number = 0;

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
     * 行2列4
     */
    public m24: number = 0;

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
     * 行3列3
     */
    public m34: number = 0;

    /**
     * 行4列1
     */
    public m41: number = 0;
    /**
     * 行4列2
     */
    public m42: number = 0;
    /**
     * 行4列3
     */
    public m43: number = 0;
    /**
     * 行4列4
     */
    public m44: number = 1;

    /**
     * 单位化矩阵
     */
    public static identity() {
        const matrix: Matrix4x4 = new Matrix4x4();
        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;
        // =======
        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;
        // =======
        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        matrix.m34 = 0.0;
        // =======
        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;
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
        this.m13 = 0.0;
        this.m14 = x;
        // =======
        this.m21 = 0.0;
        this.m22 = 1.0;
        this.m23 = 0.0;
        this.m24 = y;
        // =======
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1.0;
        this.m34 = 0.0;
        // =======
        this.m41 = 0;
        this.m42 = 0;
        this.m43 = 0.0;
        this.m44 = 1.0;

        return this;
    }

    /**
     * 旋转矩阵
     * @param angle 旋转角度
     */
    public rotation(angle: number) {
        this.m11 = 1.0;
        this.m12 = 0.0;
        this.m13 = 0.0;
        this.m14 = 0.0;
        // =======
        this.m21 = 0.0;
        this.m22 = Math.cos(angle * (Math.PI / 180));
        this.m23 = -Math.sin(angle * (Math.PI / 180));
        this.m24 = 0.0;
        // =======
        this.m31 = 0.0;
        this.m32 = Math.sin(angle * (Math.PI / 180));
        this.m33 = Math.cos(angle * (Math.PI / 180));
        this.m34 = 0.0;
        // =======
        this.m41 = 0.0;
        this.m42 = 0.0;
        this.m43 = 1.0;
        this.m44 = 1.0;

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
        this.m14 = 0.0;
        // =======
        this.m21 = 0.0;
        this.m22 = y;
        this.m23 = 0.0;
        this.m24 = 0.0;
        // =======
        this.m31 = 0.0;
        this.m32 = 0.0;
        this.m33 = 1.0;
        this.m34 = 0.0;
        // =======
        this.m41 = 0.0;
        this.m42 = 0.0;
        this.m43 = 0.0;
        this.m44 = 1.0;

        return this;
    }

    /**
     * 矩阵乘法
     * @param other 另一个矩阵
     */
    public multipli(other: Matrix4x4) {
        const m = new Matrix4x4();

        m.m11 = this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31;
        m.m12 = this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32;
        m.m13 = this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33;
        m.m14 = this.m11 * other.m14 + this.m12 * other.m24 + this.m13 * other.m34;

        m.m21 = this.m21 * other.m11 + this.m22 * other.m22 + this.m23 * other.m31;
        m.m22 = this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32;
        m.m23 = this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33;
        m.m24 = this.m21 * other.m14 + this.m22 * other.m24 + this.m23 * other.m34;

        m.m31 = this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31;
        m.m32 = this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32;
        m.m33 = this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33;
        m.m34 = this.m31 * other.m14 + this.m32 * other.m24 + this.m33 * other.m34;

        m.m41 = this.m41 * other.m11 + this.m42 * other.m21 + this.m43 * other.m31;
        m.m42 = this.m41 * other.m12 + this.m42 * other.m22 + this.m43 * other.m32;
        m.m43 = this.m41 * other.m13 + this.m42 * other.m23 + this.m43 * other.m33;
        m.m44 = this.m41 * other.m14 + this.m42 * other.m24 + this.m43 * other.m34;

        return m;
    }

    /**
     * 矩阵加法
     * @param other 被加矩形
     */
    public add(other: Matrix4x4) {
        const m = new Matrix4x4();

        m.m11 = this.m11 + other.m11;
        m.m12 = this.m12 + other.m12;
        m.m13 = this.m13 + other.m13;
        m.m14 = this.m14 + other.m14;

        m.m21 = this.m21 + other.m21;
        m.m22 = this.m22 + other.m22;
        m.m23 = this.m23 + other.m23;
        m.m24 = this.m24 + other.m24;

        m.m31 = this.m31 + other.m31;
        m.m32 = this.m32 + other.m32;
        m.m33 = this.m33 + other.m33;
        m.m34 = this.m34 + other.m34;

        m.m41 = this.m41 + other.m41;
        m.m42 = this.m42 + other.m42;
        m.m43 = this.m43 + other.m43;
        m.m44 = this.m44 + other.m44;

        return m;
    }

    /**
     * 矩阵减法
     * @param other 被减矩阵
     */
    public sub(other: Matrix4x4) {
        const m = new Matrix4x4();

        m.m11 = this.m11 - other.m11;
        m.m12 = this.m12 - other.m12;
        m.m13 = this.m13 - other.m13;
        m.m14 = this.m14 - other.m14;

        m.m21 = this.m21 - other.m21;
        m.m22 = this.m22 - other.m22;
        m.m23 = this.m23 - other.m23;
        m.m24 = this.m24 - other.m24;

        m.m31 = this.m31 - other.m31;
        m.m32 = this.m32 - other.m32;
        m.m33 = this.m33 - other.m33;
        m.m34 = this.m34 - other.m34;

        m.m41 = this.m41 - other.m41;
        m.m42 = this.m42 - other.m42;
        m.m43 = this.m43 - other.m43;
        m.m44 = this.m44 - other.m44;

        return m;
    }

    /**
     * 矩阵乘法
     * @param num 被乘数
     */
    public multipliByNum(num: number) {
        const m = new Matrix4x4();

        m.m11 = this.m11 * num;
        m.m12 = this.m12 * num;
        m.m13 = this.m13 * num;
        m.m14 = this.m14 * num;

        m.m21 = this.m21 * num;
        m.m22 = this.m22 * num;
        m.m23 = this.m23 * num;
        m.m24 = this.m24 * num;

        m.m31 = this.m31 * num;
        m.m32 = this.m32 * num;
        m.m33 = this.m33 * num;
        m.m34 = this.m34 * num;

        m.m41 = this.m41 * num;
        m.m42 = this.m42 * num;
        m.m43 = this.m43 * num;
        m.m44 = this.m44 * num;

        return m;
    }

    /**
     * 矩阵除法
     * @param num 被除数
     */
    public divisionByNum(num: number) {
        const m = new Matrix4x4();

        m.m11 = this.m11 / num;
        m.m12 = this.m12 / num;
        m.m13 = this.m13 / num;
        m.m14 = this.m14 / num;

        m.m21 = this.m21 / num;
        m.m22 = this.m22 / num;
        m.m23 = this.m23 / num;
        m.m24 = this.m24 / num;

        m.m31 = this.m31 / num;
        m.m32 = this.m32 / num;
        m.m33 = this.m33 / num;
        m.m34 = this.m34 / num;

        m.m41 = this.m41 / num;
        m.m42 = this.m42 / num;
        m.m43 = this.m43 / num;
        m.m44 = this.m44 / num;

        return m;
    }

    /**
     * 拷贝矩阵
     */
    public copy() {
        const matrix: Matrix4x4 = new Matrix4x4();
        matrix.m11 = this.m11;
        matrix.m12 = this.m12;
        matrix.m13 = this.m13;
        matrix.m14 = this.m14;
        // =======
        matrix.m21 = this.m21;
        matrix.m22 = this.m22;
        matrix.m23 = this.m23;
        matrix.m24 = this.m24;
        // =======
        matrix.m31 = this.m31;
        matrix.m32 = this.m32;
        matrix.m33 = this.m33;
        matrix.m34 = this.m34;
        // =======
        matrix.m41 = this.m41;
        matrix.m42 = this.m42;
        matrix.m43 = this.m43;
        matrix.m44 = this.m44;
        return matrix;
    }

    public toString() {
        const { m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 } = this;

        return `    [${m11.toFixed(2)},\t\t\t${m12.toFixed(2)},\t\t\t${m13.toFixed(2)},\t\t\t${m14.toFixed(2)}]
M = [${m21.toFixed(2)},\t\t\t${m22.toFixed(2)},\t\t\t${m23.toFixed(2)},\t\t\t${m24.toFixed(2)}]
    [${m31.toFixed(2)},\t\t\t${m32.toFixed(2)},\t\t\t${m33.toFixed(2)},\t\t\t${m34.toFixed(2)}]
    [${m31.toFixed(2)},\t\t\t${m32.toFixed(2)},\t\t\t${m33.toFixed(2)},\t\t\t${m44.toFixed(2)}]`;
    }
}

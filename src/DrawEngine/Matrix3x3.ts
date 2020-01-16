import Vector3 from "./Vector3";
//       [a, c, e]
//  M = [b, d, f]
//      [0, 0, 1]

/**
 * 3x3矩阵
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
     * 构造矩阵
     * @param column1 列1向量
     * @param column2 列2向量
     * @param column3 列3向量
     */
    public constructor(column1: Vector3, column2: Vector3, column3: Vector3) {
        this.m11 = column1.x;
        this.m12 = column2.x;
        this.m13 = column3.x;
        // =======
        this.m21 = column1.y;
        this.m22 = column2.y;
        this.m23 = column3.y;
        // =======
        this.m31 = column1.z;
        this.m32 = column2.z;
        this.m33 = column3.z;
    }

    /**
     * 零矩阵
     */
    public static zeroMatrix() {
        return new Matrix3x3(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    }

    /**
     * 单位化矩阵
     */
    public static identityMatrix() {
        return new Matrix3x3(new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1));
    }

    /**
     * 创建平移矩阵
     * @param x 水平方向偏移
     * @param y 垂直方向偏移
     */
    public static Translate(x: number, y: number) {
        const m = Matrix3x3.zeroMatrix();
        m.m11 = 1.0;
        m.m12 = 0.0;
        m.m13 = x;
        // =======
        m.m21 = 0.0;
        m.m22 = 1.0;
        m.m23 = y;
        // =======
        m.m31 = 0;
        m.m32 = 0;
        m.m33 = 1.0;
        return m;
    }

    /**
     * 创建旋转矩阵
     * @param angle 旋转角度
     */
    public static Rotate(angle: number) {
        const m = Matrix3x3.zeroMatrix();
        m.m11 = Math.cos(angle * (Math.PI / 180));
        m.m12 = -Math.sin(angle * (Math.PI / 180));
        m.m13 = 0.0;
        // =======
        m.m21 = Math.sin(angle * (Math.PI / 180));
        m.m22 = Math.cos(angle * (Math.PI / 180));
        m.m23 = 0.0;
        // =======
        m.m31 = 0.0;
        m.m32 = 0.0;
        m.m33 = 1.0;
        return m;
    }

    /**
     * 创建缩放矩阵
     * @param vector 缩放向量
     */
    public static Scale(vector: Vector3) {
        const m = Matrix3x3.zeroMatrix();
        m.m11 = vector.x;
        m.m12 = 0.0;
        m.m13 = 0.0;
        // =======
        m.m21 = 0.0;
        m.m22 = vector.y;
        m.m23 = 0.0;
        // =======
        m.m31 = 0.0;
        m.m32 = 0.0;
        m.m33 = 1.0;
        return m;
    }

    /**
     * 矩阵乘法
     * @param lhs
     * @param rhs
     */
    public static Multiplies(lhs: Matrix3x3, rhs: Matrix3x3) {
        const m = Matrix3x3.zeroMatrix();

        m.m11 = lhs.m11 * rhs.m11 + lhs.m12 * rhs.m21 + lhs.m13 * rhs.m31;
        m.m12 = lhs.m11 * rhs.m12 + lhs.m12 * rhs.m22 + lhs.m13 * rhs.m32;
        m.m13 = lhs.m11 * rhs.m13 + lhs.m12 * rhs.m23 + lhs.m13 * rhs.m33;

        m.m21 = lhs.m21 * rhs.m11 + lhs.m22 * rhs.m21 + lhs.m23 * rhs.m31;
        m.m22 = lhs.m21 * rhs.m12 + lhs.m22 * rhs.m22 + lhs.m23 * rhs.m32;
        m.m23 = lhs.m21 * rhs.m13 + lhs.m22 * rhs.m23 + lhs.m23 * rhs.m33;

        m.m31 = lhs.m31 * rhs.m11 + lhs.m32 * rhs.m21 + lhs.m33 * rhs.m31;
        m.m32 = lhs.m31 * rhs.m12 + lhs.m32 * rhs.m22 + lhs.m33 * rhs.m32;
        m.m33 = lhs.m31 * rhs.m13 + lhs.m32 * rhs.m23 + lhs.m33 * rhs.m33;

        return m;
    }

    /**
     * 矩阵与向量相乘
     * @param lhs
     * @param vector
     */
    public static MultipliesVector(lhs: Matrix3x3, vector: Vector3) {
        const vector3: Vector3 = Vector3.zero();

        vector3.x = lhs.m11 * vector.x + lhs.m21 * vector.y + lhs.m31 * vector.z;
        vector3.y = lhs.m12 * vector.x + lhs.m22 * vector.y + lhs.m32 * vector.z;
        vector3.z = lhs.m13 * vector.x + lhs.m23 * vector.y + lhs.m33 * vector.z;

        return vector3;
    }

    /**
     * 矩阵是否相等
     * @param lhs
     * @param rhs
     */
    public static Equals(lhs: Matrix3x3, rhs: Matrix3x3) {
        return lhs.m11 === rhs.m11 && lhs.m12 === rhs.m12 && lhs.m13 === rhs.m13 && lhs.m21 === rhs.m21 && lhs.m22 === rhs.m22 && lhs.m23 === rhs.m23 && lhs.m31 === rhs.m31 && lhs.m32 === rhs.m32 && lhs.m33 === rhs.m33;
    }

    /**
     * 矩阵加法
     * @param a
     * @param b
     */
    public static Adds(a: Matrix3x3, b: Matrix3x3) {
        const m = Matrix3x3.zeroMatrix();

        m.m11 = a.m11 + b.m11;
        m.m12 = a.m12 + b.m12;
        m.m13 = a.m13 + b.m13;

        m.m21 = a.m21 + b.m21;
        m.m22 = a.m22 + b.m22;
        m.m23 = a.m23 + b.m23;

        m.m31 = a.m31 + b.m31;
        m.m32 = a.m32 + b.m32;
        m.m33 = a.m33 + b.m33;

        return m;
    }

    /**
     * 矩阵减法
     * @param other 被减矩阵
     */
    public Subtracts(lhs: Matrix3x3, rhs: Matrix3x3) {
        const m = Matrix3x3.zeroMatrix();

        m.m11 = lhs.m11 + rhs.m11;
        m.m12 = lhs.m12 + rhs.m12;
        m.m13 = lhs.m13 + rhs.m13;

        m.m21 = lhs.m21 + rhs.m21;
        m.m22 = lhs.m22 + rhs.m22;
        m.m23 = lhs.m23 + rhs.m23;

        m.m31 = lhs.m31 + rhs.m31;
        m.m32 = lhs.m32 + rhs.m32;
        m.m33 = lhs.m33 + rhs.m33;

        return m;
    }

    /**
     * 拷贝矩阵
     */
    public copy() {
        const m = Matrix3x3.zeroMatrix();
        m.m11 = this.m11;
        m.m12 = this.m12;
        m.m13 = this.m13;
        // =======
        m.m21 = this.m21;
        m.m22 = this.m22;
        m.m23 = this.m23;
        // =======
        m.m31 = this.m31;
        m.m32 = this.m32;
        m.m33 = this.m33;
        return m;
    }

    /**
     * 矩阵字符串
     */
    public toString() {
        const { m11, m12, m13, m21, m22, m23, m31, m32, m33 } = this;

        return `    [${m11.toFixed(2)},\t\t\t${m12.toFixed(2)},\t\t\t${m13.toFixed(2)}]
M = [${m21.toFixed(2)},\t\t\t${m22.toFixed(2)},\t\t\t${m23.toFixed(2)}]
    [${m31.toFixed(2)},\t\t\t${m32.toFixed(2)},\t\t\t${m33.toFixed(2)}]`;
    }
}

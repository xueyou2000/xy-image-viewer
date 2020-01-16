import Mathf from "./Mathf";

/**
 * 3D向量
 * @description 同时具有大小和方向的物理量. 向量没有位置.
 * 几何意义上来说: 向量是有大小和方向的又向线段
 * 零向量是唯一没有方向的向量
 * @see https://docs.unity3d.com/ScriptReference/Vector3.html
 * @see https://blog.csdn.net/bobo553443/article/details/79481881
 */
export default class Vector3 {
    public static kEpsilonNormalSqrt: number = 1e-15;

    /**
     * x轴的分量
     */
    public x: number;

    /**
     * y轴的分量
     */
    public y: number;

    /**
     * z轴的分量
     */
    public z: number;

    /**
     * 构造所有分量都为0的向量
     * @param x
     * @param y
     * @param z
     */
    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * 拷贝向量
     */
    public Copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * 返回此向量的平方长度(模)
     * @description 利用勾股定理, 取各分量平方和的平方根
     */
    public get magnitude() {
        return Math.sqrt(this.sqrMagnitude);
    }

    /**
     * 返回此向量的长度
     * @description 各分量平方的和
     */
    public get sqrMagnitude() {
        const { x, y, z } = this;
        return Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2);
    }

    /**
     * 归一化向量. 不改变当前向量,而是返回新向量
     * @description 归一化后方向不变, 长度为1.0, 向量太小无法归一化, 则返回零向量
     * 将向量化为方向不变, 长度为1的向量, 也称为 单位向量 或 法线.
     */
    public get normalized() {
        const { x, y, z } = this;
        // 获取向量长度
        const length = this.magnitude;
        // 标准化向量, 使其长度为1, 方向不变.
        return new Vector3(x / length, y / length, z / length);
    }

    /**
     * 缩放向量
     * @param scale
     */
    public Scale(scale: Vector3) {
        this.x *= scale.x;
        this.y *= scale.y;
        this.z *= scale.z;
    }

    /**
     * 向量是否相等
     * @param other
     */
    public Equals(other: Vector3) {
        const { x, y, z } = this;
        return x === other.x && y === other.y && z === other.z;
    }

    // 静态方法 =========================

    /**
     * 两个向量之间的线性插值。
     * @param a
     * @param b
     * @param t
     */
    public static Lerp(a: Vector3, b: Vector3, t: number): Vector3 {
        t = Mathf.Clamp01(t);
        return new Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
    }

    /**
     * 向量点乘
     * @description 两个向量点乘得到一个标量, 数值等于两个向量长度相乘再乘以两者夹角的余弦值
     * 如果两个向量a,b均为单位向量，那么a.b等于向量b在向量a方向上的投影的长度（或者说向量a在向量b方向上的投影）
     * @param lhs
     * @param rhs
     */
    public static Dot(lhs: Vector3, rhs: Vector3) {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    }

    /**
     * 由from和to两者返回一个角度
     * @description 这个角度永远是最小的
     * @example
     * Vector3 targetDir = target.position - transform.position;
     * float angle = Vector3.Angle(targetDir, transform.forward);
     */
    public static Angle(from: Vector3, to: Vector3): number {
        const denominator = Mathf.Sqrt(from.sqrMagnitude * to.sqrMagnitude);
        if (denominator < Vector3.kEpsilonNormalSqrt) {
            return 0;
        }
        const dot = Mathf.Clamp(Vector3.Dot(from, to) / denominator, -1, 1);
        return Mathf.Acos(dot) * Mathf.Rad2Deg;
    }

    /**
     * 两个向量的交叉乘积。返回lhs x rhs
     * @description 两个向量的叉乘得到一个新的向量，新向量垂直与原来的两个向量，并且长度等于原来向量长度相乘后夹角的正弦值
     * 注意: 叉乘不满足交换律, axb不等于bxa
     * @example
     * Vector3 targetDir = target.position - transform.position;
     * float angle = Vector3.Angle(targetDir, transform.forward);
     */
    public static Cross(lhs: Vector3, rhs: Vector3): Vector3 {
        return new Vector3(lhs.y * rhs.z - lhs.z * rhs.y, lhs.z * rhs.x - lhs.x * rhs.z, lhs.x * rhs.y - lhs.y * rhs.x);
    }

    /**
     * 返回a和b之间的距离。
     * @param a
     * @param b
     */
    public static Distance(a: Vector3, b: Vector3): number {
        const diff_x = a.x - b.x;
        const diff_y = a.y - b.y;
        const diff_z = a.z - b.z;
        return Mathf.Sqrt(diff_x * diff_x + diff_y * diff_y + diff_z * diff_z);
    }

    /**
     * 返回2个向量的最小分量组成的向量
     * @param lhs
     * @param rhs
     */
    public static Min(lhs: Vector3, rhs: Vector3) {
        return Math.min(Mathf.Min(lhs.x, rhs.x), Mathf.Min(lhs.y, rhs.y), Mathf.Min(lhs.z, rhs.z));
    }

    /**
     * 返回2个向量的最大分量组成的向量
     * @param lhs
     * @param rhs
     */
    public static Max(lhs: Vector3, rhs: Vector3) {
        return Math.min(Mathf.Max(lhs.x, rhs.x), Mathf.Max(lhs.y, rhs.y), Mathf.Max(lhs.z, rhs.z));
    }

    /**
     * 计算当前点和目标点之间的位置, 并移动的距离不超过maxDistanceDelta
     * @param current
     * @param target
     * @param maxDistanceDelta
     */
    public static MoveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number) {
        const toVector_x = target.x - current.x;
        const toVector_y = target.y - current.y;
        const toVector_z = target.z - current.z;

        const sqdist = toVector_x * toVector_x + toVector_y * toVector_y + toVector_z * toVector_z;
        if (sqdist == 0 || (maxDistanceDelta >= 0 && sqdist <= maxDistanceDelta * maxDistanceDelta)) {
            return target;
        }

        var dist = Mathf.Sqrt(sqdist);
        return new Vector3(current.x + (toVector_x / dist) * maxDistanceDelta, current.y + (toVector_y / dist) * maxDistanceDelta, current.z + (toVector_z / dist) * maxDistanceDelta);
    }

    /**
     * 由缩放的相同的组件对应乘以这个矢量的每个组件。
     * @param a
     * @param b
     */
    public static Scale(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    // 静态操作方法 =========================

    /**
     * 向量加法
     * @param a
     * @param b
     */
    public static Adds(a: Vector3, b: Vector3) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    /**
     * 向量减法
     * @param a
     * @param b
     */
    public static Subtracts(a: Vector3, b: Vector3) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    /**
     * 向量各分量取反
     * @param a
     */
    public static Negates(a: Vector3) {
        return new Vector3(-a.x, -a.y, -a.z);
    }

    /**
     * 向量数乘
     * @description 实数和向量相乘的过程就是数乘, 如果实数大于0 那么数乘后的向量的方向和原始向量的方向一致，如果实数小于0 那么数乘后的向量的方向和原始向量的方向相反
     * 数乘的几何意义：就是沿着原始变量的方向或者变量的相反方向放大或者缩小
     * @param a
     * @param d
     */
    public static Multiplie(a: Vector3, d: number) {
        return new Vector3(a.x * d, a.y * d, a.z * d);
    }

    /**
     * 向量除法
     * @param a
     * @param d
     */
    public static Divides(a: Vector3, d: number) {
        return new Vector3(a.x / d, a.y / d, a.z / d);
    }

    // 构造静态字段 =========================

    /**
     * 背面向量
     * Vector3(0, 0, -1)
     */
    public static back() {
        return new Vector3(0, 0, -1);
    }

    /**
     * 背下量
     * Vector3(0, -1, 0)
     */
    public static down() {
        return new Vector3(0, -1, 0);
    }

    /**
     * Z轴
     * Vector3(0, 0, 1)
     */
    public static forward() {
        return new Vector3(0, 0, 1);
    }

    /**
     * 左边向量
     * Vector3(-1, 0, 0)
     */
    public static left() {
        return new Vector3(-1, 0, 0);
    }

    /**
     * 一向量
     * Vector3(1, 1, 1)
     */
    public static one() {
        return new Vector3(1, 1, 1);
    }

    /**
     * X轴
     * Vector3(1, 0, 0)
     */
    public static right() {
        return new Vector3(1, 0, 0);
    }

    /**
     * 上向量
     * Vector3(0, 1, 0)
     */
    public static up() {
        return new Vector3(0, 1, 0);
    }

    /**
     * 零向量
     * Vector3(0, 0, 0)
     */
    public static zero() {
        return new Vector3();
    }
}

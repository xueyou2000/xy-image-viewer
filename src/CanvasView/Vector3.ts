/**
 * 3D向量
 * @see https://docs.unity3d.com/ScriptReference/Vector3.html
 */
export default class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * 向量是否相等
     * @param other
     */
    public equals(other: Vector3) {
        const { x, y, z } = this;
        return x === other.x && y === other.y && z === other.z;
    }

    /**
     * 由from和to两者返回一个角度。
     * @example
     * Vector3 targetDir = target.position - transform.position;
     * float angle = Vector3.Angle(targetDir, transform.forward);
     */
    public static agenle(from: Vector3, to: Vector3): number {
        // TODO
        return 0;
    }

    /**
     * 两个向量的交叉乘积。返回lhs x rhs
     * @example
     * Vector3 targetDir = target.position - transform.position;
     * float angle = Vector3.Angle(targetDir, transform.forward);
     */
    public static cross(lhs: Vector3, rhs: Vector3): Vector3 {
        // TODO
        return Vector3.zero();
    }

    /**
     * 返回a和b之间的距离。
     */
    public static distance(a: Vector3, b: Vector3): number {
        // TODO
        return 0;
    }

    /**
     * 由缩放的相同的组件对应乘以这个矢量的每个组件。
     * @param a
     * @param b
     */
    public scale(a: Vector3, b: Vector3): Vector3 {
        return Vector3.zero();
    }

    /**
     * 两个向量之间的线性插值。
     * @param a
     * @param b
     * @param t
     */
    public lerp(a: Vector3, b: Vector3, t: number): Vector3 {
        return Vector3.zero();
    }

    /**
     * 球形插值在两个向量之间。
     * @param a
     * @param b
     * @param t
     */
    public slerp(a: Vector3, b: Vector3, t: number): Vector3 {
        return Vector3.zero();
    }

    /**
     * 使向量规范化并且彼此相互垂直。
     * @param normal ref参数, 会被改变
     * @param tangent ref参数, 会被改变
     */
    public OrthoNormalize(normal: Vector3, tangent: Vector3) {}

    /**
     * 零向量
     * Vector3(0, 0, 0)
     */
    public static zero() {
        return new Vector3();
    }

    /**
     * 一向量
     * Vector3(1, 1, 1)
     */
    public static one() {
        return new Vector3(1, 1, 1);
    }

    /**
     * Z轴
     * Vector3(0, 0, 1)
     */
    public static forward() {
        return new Vector3(0, 0, 1);
    }

    /**
     * Y轴
     * Vector3(0, 1, 0)
     */
    public static up() {
        return new Vector3(0, 1, 0);
    }

    /**
     * X轴
     * Vector3(1, 0, 0)
     */
    public static right() {
        return new Vector3(1, 0, 0);
    }
}

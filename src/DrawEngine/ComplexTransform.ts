import Vector3 from "./Vector3";
import Matrix3x3 from "./Matrix3x3";

/**
 * 复合变换信息
 * @description 存放 缩放比例, 旋转角度, 平移向量等标量, 进行矩阵操作
 */
export default class ComplexTransform {
    /**
     * 当前位置
     */
    private potisiton: Vector3 = Vector3.forward();

    /**
     * 旋转角度
     */
    private angle: number = 0;

    /**
     * 缩放比例
     */
    private scale: number = 1;

    /**
     * 增加平移位置
     * @param x
     * @param y
     */
    public AddPosition(x: number, y: number) {
        this.potisiton.x += x;
        this.potisiton.y += y;
    }

    /**
     * 增加角度
     * @param angle 角度
     */
    public AddAngle(angle: number) {
        this.angle = this.angle + (angle % 360);
    }

    /**
     * 增加缩放比例
     * @param scale
     */
    public AddScale(scale: number) {
        this.scale += scale;
    }

    /**
     * 设置平移位置
     * @param x
     * @param y
     */
    public SetPosition(x: number, y: number) {
        this.potisiton.x = x;
        this.potisiton.y = y;
    }

    /**
     * 设置角度
     * @param angle 角度
     */
    public SetAngle(angle: number) {
        this.angle = angle % 360;
    }

    /**
     * 设置缩放比例
     * @param scale
     */
    public SetScale(scale: number) {
        this.scale = scale;
    }

    /**
     * 获取平移坐标
     */
    public GetPosition() {
        return this.potisiton;
    }

    /**
     * 获取旋转角度
     */
    public GetAngle() {
        return this.angle;
    }

    /**
     * 获取缩放比例
     */
    public GetScale() {
        return this.scale;
    }

    /**
     * 获取最新矩阵
     * 平移矩阵 * 旋转矩阵  * 缩放矩阵
     */
    public UpdateMatrix() {
        const { potisiton, angle, scale } = this;

        let m: Matrix3x3;
        m = Matrix3x3.Translate(potisiton.x, potisiton.y);
        m = Matrix3x3.Multiplies(m, Matrix3x3.Rotate(angle));
        m = Matrix3x3.Multiplies(m, Matrix3x3.Scale(new Vector3(scale, scale, 1)));

        return m;
    }

    /**
     * 各标量加法
     * @param other
     */
    public Adds(other: ComplexTransform) {
        this.potisiton = Vector3.Adds(this.potisiton, other.potisiton);
        this.angle += other.angle;
        this.scale += other.scale;
        return this;
    }

    /**
     * 各标量减法
     * @param other
     */
    public Subtracts(other: ComplexTransform) {
        this.potisiton = Vector3.Subtracts(this.potisiton, other.potisiton);
        this.angle -= other.angle;
        this.scale -= other.scale;
        return this;
    }

    /**
     * 各标量数乘
     * @param num 被乘数
     */
    public Multiplie(num: number) {
        this.potisiton = Vector3.Multiplie(this.potisiton, num);
        this.angle *= num;
        this.scale *= num;
        return this;
    }

    /**
     * 各标量数除
     * @param num 被除数
     */
    public Divides(num: number) {
        this.potisiton = Vector3.Divides(this.potisiton, num);
        this.angle /= num;
        this.scale /= num;
        return this;
    }

    /**
     * 各标量加法
     * @param lct
     * @param rct
     */
    public static Adds(lct: ComplexTransform, rct: ComplexTransform) {
        const ct = new ComplexTransform();
        ct.potisiton = Vector3.Adds(lct.potisiton, rct.potisiton);
        ct.angle = lct.angle + rct.angle;
        ct.scale = lct.scale + rct.scale;
        return ct;
    }

    /**
     * 各标量减法
     * @param lct
     * @param rct
     */
    public static Subtracts(lct: ComplexTransform, rct: ComplexTransform) {
        const ct = new ComplexTransform();
        ct.potisiton = Vector3.Subtracts(lct.potisiton, rct.potisiton);
        ct.angle = lct.angle - rct.angle;
        ct.scale = lct.scale - rct.scale;
        return ct;
    }

    /**
     * 各标量数乘
     * @param lct
     * @param num   被乘数
     */
    public static Multiplie(lct: ComplexTransform, num: number) {
        const ct = new ComplexTransform();
        ct.potisiton = Vector3.Multiplie(lct.potisiton, num);
        ct.angle = lct.angle * num;
        ct.scale = lct.scale * num;
        return ct;
    }

    /**
     * 各标量数除
     * @param lct
     * @param num   被除数
     */
    public static Divides(lct: ComplexTransform, num: number) {
        const ct = new ComplexTransform();
        ct.potisiton = Vector3.Divides(lct.potisiton, num);
        ct.angle = lct.angle / num;
        ct.scale = lct.scale / num;
        return ct;
    }

    /**
     * 拷贝复合转换信息
     */
    public Copy() {
        const ct = new ComplexTransform();
        ct.potisiton = this.potisiton.Copy();
        ct.angle = this.angle;
        ct.scale = this.scale;
        return ct;
    }
}

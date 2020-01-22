import Vector3 from "./Vector3";
import Matrix3x3 from "./Matrix3x3";
import { Point, Mathf } from ".";
import { Rect } from "./interface";

/**
 * 复合变换信息
 * @description 存放 缩放比例, 旋转角度, 平移向量等标量, 进行矩阵操作
 */
export default class ComplexTransform {
    /**
     * 图片中心偏移位置
     */
    private potisiton: Vector3 = Vector3.forward();

    /**
     * 画布偏移位置
     */
    private offset: Vector3 = Vector3.forward();

    /**
     * 旋转角度
     */
    private angle: number = 0;

    /**
     * 缩放比例
     */
    private scale: number = 1;

    /**
     * 缓存变换矩阵
     */
    private matrix: Matrix3x3 = Matrix3x3.identityMatrix();

    /**
     * 增加图像中心位置
     * @param x
     * @param y
     */
    public AddPosition(x: number, y: number) {
        this.potisiton.x += x;
        this.potisiton.y += y;
        return this;
    }

    /**
     * 增加平移位置
     * @param x
     * @param y
     */
    public AddOffset(x: number, y: number) {
        this.offset.x += x;
        this.offset.y += y;
        return this;
    }

    /**
     * 增加角度
     * @param angle 角度
     */
    public AddAngle(angle: number) {
        this.angle = this.angle + (angle % 360);
        return this;
    }

    /**
     * 增加缩放比例
     * @param scale
     */
    public AddScale(scale: number) {
        this.scale += scale;
        return this;
    }

    /**
     * 设置画布中心位置
     * @param x
     * @param y
     */
    public SetPosition(x: number, y: number) {
        this.potisiton.x = x;
        this.potisiton.y = y;
        return this;
    }

    /**
     * 设置平移位置
     * @param x
     * @param y
     */
    public SetOffset(x: number, y: number) {
        this.offset.x = x;
        this.offset.y = y;
        return this;
    }

    /**
     * 设置角度
     * @param angle 角度
     */
    public SetAngle(angle: number) {
        this.angle = angle % 360;
        return this;
    }

    /**
     * 设置缩放比例
     * @param scale
     */
    public SetScale(scale: number) {
        this.scale = scale;
        return this;
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
     * 更新矩阵
     * 记住一点：last specified, first  applied（后指定的变化，先被执行变化）
     */
    public UpdateMatrix = () => {
        const { potisiton, angle, scale, offset } = this;

        let m: Matrix3x3 = Matrix3x3.Translate(offset.x, offset.y);
        m = Matrix3x3.Multiplies(m, Matrix3x3.Scale(new Vector3(scale, scale, 1)));
        m = Matrix3x3.Multiplies(m, Matrix3x3.Rotate(angle));
        m = Matrix3x3.Multiplies(m, Matrix3x3.Translate(potisiton.x, potisiton.y));
        return m;
    };

    /**
     * 各标量加法
     * @param other
     */
    public Adds(other: ComplexTransform) {
        this.potisiton = Vector3.Adds(this.potisiton, other.potisiton);
        this.offset = Vector3.Adds(this.offset, other.offset);
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
        this.offset = Vector3.Subtracts(this.offset, other.offset);
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
        this.offset = Vector3.Multiplie(this.offset, num);
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
        this.offset = Vector3.Divides(this.offset, num);
        this.angle /= num;
        this.scale /= num;
        return this;
    }

    /**
     * 获取变换后的矩形
     */
    public GetPresentRect(width: number, height: number): Rect {
        const { angle, scale } = this;
        const rect = Mathf.CalcRotateRect(width, height, angle);
        return { x: 0, y: 0, width: rect.width * scale, height: rect.height * scale };
    }

    /**
     * 各标量加法
     * @param lct
     * @param rct
     */
    public static Adds(lct: ComplexTransform, rct: ComplexTransform) {
        const ct = new ComplexTransform();
        ct.potisiton = Vector3.Adds(lct.potisiton, rct.potisiton);
        ct.offset = Vector3.Adds(lct.offset, rct.offset);
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
        ct.offset = Vector3.Subtracts(lct.offset, rct.offset);
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
        ct.offset = Vector3.Multiplie(lct.offset, num);
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
        ct.offset = Vector3.Divides(lct.offset, num);
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
        ct.offset = this.offset.Copy();
        ct.angle = this.angle;
        ct.scale = this.scale;
        return ct;
    }

    /**
     * 是否相等
     * @param other
     */
    public Equals(other: ComplexTransform) {
        const { potisiton, offset, angle, scale } = this;
        return potisiton.Equals(other.potisiton) && offset.Equals(other.offset) && angle === other.angle && scale === other.scale;
    }
}

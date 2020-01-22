/**
 * 通用的数学方法集合
 */
export default class Mathf {
    /**
     * 圆周率
     * 近似于 3.14159265358979
     */
    public static PI = Math.PI;

    /**
     * 度到弧度的转换常数
     */
    public static Deg2Rad = (Mathf.PI * 2) / 360;

    /**
     * 弧度转换常数
     */
    public static Rad2Deg = 1 / Mathf.Deg2Rad;

    /**
     * 返回f的平方根
     * @param f
     */
    public static Sqrt(f: number) {
        return Math.sqrt(f);
    }

    /**
     * 返回f的反余弦值, 余弦为f的弧度角
     * @param f
     */
    public static Acos(f: number) {
        return Math.acos(f);
    }

    /**
     * 返回最小的数
     * @param a
     * @param b
     */
    public static Min(a: number, b: number) {
        return Math.min(a, b);
    }

    /**
     * 返回最大的数
     * @param a
     * @param b
     */
    public static Max(a: number, b: number) {
        return Math.max(a, b);
    }

    /**
     * 将值钳在0和1之间并返回值
     * @param value
     */
    public static Clamp01(value: number) {
        if (value < 0) {
            return 0;
        } else if (value > 1) {
            return 1;
        } else {
            return value;
        }
    }

    /**
     * 将数值钳在min~max之间
     * @param value
     * @param min 最小值
     * @param max 最大值
     */
    public static Clamp(value: number, min: number, max: number) {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        return value;
    }

    /**
     * 获取旋转后的矩形
     * @param width 宽度
     * @param height 高度
     * @param angle 旋转角度
     */
    public static CalcRotateRect(width: number, height: number, angle: number) {
        const _width = Math.cos((90 - angle) * (Math.PI / 180)) * height + Math.cos(angle * (Math.PI / 180)) * width;
        const _height = Math.sin(angle * (Math.PI / 180)) * width + Math.cos((90 - (90 - angle)) * (Math.PI / 180)) * height;

        return { width: _width, height: _height };
    }
}

/**
 * 勾股定理计算缩放比例
 * @param p1
 * @param p2
 */
export function getDistance(p1: Touch, p2: Touch) {
    var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
    return Math.sqrt(x * x + y * y);
}

/**
 * 获取旋转角度
 * @param p1
 * @param p2
 */
export function getAngle(p1: Touch, p2: Touch) {
    var x = p1.pageX - p2.pageX,
        y = p1.pageY - p2.pageY;
    return (Math.atan2(y, x) * 180) / Math.PI;
}

/**
 * 加载图片
 * @param src 图片地址
 */
export function imageLoad(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;

        if (img.complete) {
            resolve(img);
        } else {
            img.onload = () => resolve(img);
            img.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => reject(error || new Error("图片加载失败"));
            img.onabort = () => reject(new Error("图片加载中断"));
        }
    });
}

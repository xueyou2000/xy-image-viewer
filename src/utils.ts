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

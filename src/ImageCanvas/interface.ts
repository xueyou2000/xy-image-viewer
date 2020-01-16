/**
 * CanvasView选项配置
 */
export interface CanvasViewOptions {
    /**
     * 全屏画布
     */
    fullScreen?: boolean;
    /**
     * 画布宽度
     */
    width?: number;
    /**
     * 画布高度
     */
    height?: number;
    /**
     * 图片开始加载事件
     */
    onStart?: Function;
    /**
     * 图片加载完毕事件
     */
    onLoad?: Function;
    /**
     * 图片加载失败事件
     */
    onError?: (error: Error) => void;
}

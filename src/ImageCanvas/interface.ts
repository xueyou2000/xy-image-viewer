import ImageCanvas from ".";

/**
 * CanvasView选项配置
 */
export interface CanvasViewOptions {
    /**
     * 窗口监听尺寸变化更新画布
     */
    resize?: boolean;
    /**
     * 是否鼠标滚动缩放
     */
    zoomOnWheel?: boolean;
    /**
     * 缩放最小比例
     */
    zoomMin?: number;
    /**
     * 缩放最大比例
     */
    zoomMax?: number;
    /**
     * 是否允许手势旋转
     */
    gestureRotate?: boolean;
    /**
     * 缩放比率
     */
    zoomRatio?: number;
    /**
     * 画布固定宽度(可选)
     */
    width?: number;
    /**
     * 画布固定高度(可选)
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
    /**
     * 缩放改变事件
     */
    onZoom?: (scale: number, imageCanvas: ImageCanvas) => void;
}

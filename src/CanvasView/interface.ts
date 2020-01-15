import Point from "./Point";

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

/**
 * 图像状态
 */
export interface ImageState {
    /**
     * 是否水平翻转
     */
    flipX?: boolean;
    /**
     * 是否垂直翻转
     */
    flipY?: boolean;
    /**
     * 缩放点
     */
    scalePoint?: Point;
    /**
     * 缩放比例
     * 1=图像原始大小
     */
    scale?: number;
    /**
     * 旋转角度
     * 取值范围0 ~ 360度
     */
    rotate?: number;
    /**
     * 平移距离
     * 一般用于拖动操作
     */
    translate?: Point;
}

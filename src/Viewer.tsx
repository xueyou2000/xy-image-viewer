import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import ImageCanvas from "./ImageCanvas";
import Loading from "./Loading";
import { useMount } from "utils-hooks";

export interface ViewerProps {
    /**
     * 附加类名
     */
    prefixCls?: string;
    /**
     * 根节点附加类名
     */
    className?: string;
    /**
     * 内敛样式
     */
    style?: React.CSSProperties;
    /**
     * 查看图片
     */
    src?: string;
    /**
     * 画布宽度
     */
    width?: number;
    /**
     * 画布高度
     */
    height?: number;
}

/**
 * Canvas图像画布
 */
function Viewer(props: ViewerProps) {
    const { prefixCls = "xy-viewer", className, style, src, width, height } = props;
    const ref = useRef<HTMLCanvasElement>(null);
    const imageCanvas = useRef<ImageCanvas>(null);
    const [loading, setLoading] = useState(false);

    useMount(() => {
        const canvas = ref.current;
        if (canvas) {
            imageCanvas.current = new ImageCanvas(canvas, {
                width,
                height,
                onStart: () => setLoading(true),
                onLoad: () => setLoading(false),
            });
        }
    });

    useEffect(() => {
        if (imageCanvas.current) {
            imageCanvas.current.loadImage(src);
        }
    }, [src]);

    return (
        <div className={classNames(prefixCls, className)} style={style}>
            <canvas width={width} height={height} ref={ref} />
            {loading && <Loading />}
        </div>
    );
}

export default React.memo(Viewer);

import classNames from "classnames";
import React, { useRef, useEffect } from "react";
import { GetDrawerContainerFuc, useControll, useTranstion, usePortal, ENTERED, EXITED } from "utils-hooks";
import Viewer from "./Viewer";

export interface ImageViewerProps {
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
     * 动画类名
     */
    animateClassName?: string;
    /**
     * 弹出附加类名
     */
    popupClassName?: string;
    /**
     * 弹出框内容元素类名
     */
    popupContentCLassName?: string;
    /**
     * 关闭事件
     */
    onUnmount?: Function;
    /**
     * 是否显示遮罩层
     */
    mask?: boolean;
    /**
     * 背景遮罩是否可关闭
     */
    maskClose?: boolean;
    /**
     * 是否显示
     */
    visible?: boolean;
    /**
     * 默认是否显示
     */
    defaultVisible?: boolean;
    /**
     * 显示改变
     */
    onVisibleChange?: (visible: boolean) => void;
    /**
     * 返回一个容器来装载内容
     * @description 默认为body内创建一个div作为容器
     */
    getContainer?: HTMLElement | GetDrawerContainerFuc;
}

/**
 * 图片查看器
 */
function ImageViewer(props: ImageViewerProps) {
    const { prefixCls = "xy-image-viewer", className, style, animateClassName = "fade", popupClassName, popupContentCLassName, onUnmount, onVisibleChange, getContainer, mask, maskClose } = props;
    const [visible, setVisible, isControll] = useControll(props, "visible", "defaultVisible");
    const [ref, state] = useTranstion(visible);
    const opening = state.indexOf("en") !== -1;
    const animateclassString = classNames(animateClassName, `${animateClassName}-state-${state}`, {
        [`${animateClassName}-open`]: opening,
    });
    const firstFlagRef = useRef(visible);
    const [renderPortal] = usePortal("", getContainer);

    function handleChange(_open: boolean) {
        if (!isControll) {
            setVisible(_open);
        }
        if (onVisibleChange) {
            onVisibleChange(_open);
        }
    }

    function closeByMask() {
        if (maskClose) {
            handleChange(false);
        }
    }

    useEffect(() => {
        if (state === ENTERED) {
            firstFlagRef.current = true;
        } else if (state === EXITED && firstFlagRef.current === true) {
            if (onUnmount) {
                onUnmount();
            }
        }
    }, [state]);

    return renderPortal(
        <div className={classNames(prefixCls, popupClassName, `${prefixCls}-state-${state}`, { [`${prefixCls}-open`]: opening })}>
            <div className={classNames(`${prefixCls}-mask`, { "hidden-mask": !mask })} onClick={closeByMask} />
            <div className={classNames(`${prefixCls}-content`, className, popupContentCLassName, animateclassString)} style={style} ref={ref}>
                <Viewer />
            </div>
        </div>,
    );
}

export default React.memo(ImageViewer);

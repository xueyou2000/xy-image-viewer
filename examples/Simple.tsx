import React from "react";
import { Viewer } from "../src";
import "./index.scss";

export default function() {
    return (
        <div>
            <Viewer width={700} height={350} src="https://fengyuanchen.github.io/jquery-viewer/images/tibet-6.jpg" className="full-canvas" />
        </div>
    );
}

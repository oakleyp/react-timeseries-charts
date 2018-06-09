/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as React from "react";

import { LabelValueList } from "./types";
import { InfoBoxStyle, defaultInfoBoxStyle as defaultStyle } from "./style";

export type ValueListProps = {
    /**
     * Where to position the label, either `left` or `center` within the box
     */
    align?: "center" | "left";

    /**
     * An array of label value pairs to render where each pair is of the type
     * {label: "", value: "15.7mph"}
     */
    values: LabelValueList;

    /**
     * The style of the info box. It is an object containing the styling for the 
     * text and the box
     * 
     * For example:
     * ```
     * const style = {
     *      text: {
     *          fontSize: 11,
     *          fill: "#bdbdbd",
     *      },
     *      box: {
     *          fill: "#FEFEFE",
     *          stroke: "#DDD",
     *      }
     * }
     */
    style?: InfoBoxStyle;

    /**
     * The width of the rectangle to render into
     */
    width?: number;

    /**
     * The height of the rectangle to render into
     */
    height?: number;
};

/**
 * Renders a box of size `width` and `height` and places a list of label
 * value pairs within that box, `align`ed to the left or center within
 * the box. The `style` prop is a CSS properties object that will be
 * applied to the box.
 *
 *      +----------------+
 *      | Max 100 Gbps   |
 *      | Avg 26 Gbps    |
 *      +----------------+
 *
 */
export class ValueList extends React.Component<ValueListProps> {
    static defaultProps: Partial<ValueListProps> = {
        align: "center",
        width: 100,
        height: 100,
        style: defaultStyle
    };

    render() {
        const { align, style, width, height } = this.props;

        if (!this.props.values.length) {
            return <g />;
        }

        const textStyle: React.CSSProperties = {
            ...style.text,
            textAnchor: "start",
            pointerEvents: "none"
        };
        const textStyleCentered: React.CSSProperties = {
            ...style.text,
            textAnchor: "middle",
            pointerEvents: "none"
        };

        const values = this.props.values.map((item, i) => {
            if (align === "left") {
                return (
                    <g key={i}>
                        <text x={10} y={5} dy={`${(i + 1) * 1.2}em`} style={textStyle}>
                            <tspan style={{ fontWeight: 700 }}>{`${item.label}: `}</tspan>
                            <tspan>{`${item.value}`}</tspan>
                        </text>
                    </g>
                );
            }

            const posx = Math.round(this.props.width / 2);
            return (
                <g key={i}>
                    <text x={posx} y={5} dy={`${(i + 1) * 1.2}em`} style={textStyleCentered}>
                        <tspan style={{ fontWeight: 700 }}>{`${item.label}: `}</tspan>
                        <tspan>{`${item.value}`}</tspan>
                    </text>
                </g>
            );
        });
        
        const box = <rect style={style.box} x={0} y={0} width={width} height={height} />;
        return (
            <g>
                {box}
                {values}
            </g>
        );
    }
}
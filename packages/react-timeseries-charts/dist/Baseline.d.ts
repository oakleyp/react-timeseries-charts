/// <reference types="react" />
import * as React from "react";
import { ChartProps } from "./Charts";
import { BaselineStyle } from "./style";
export declare type BaselineProps = ChartProps & {
    axis: string;
    style?: BaselineStyle;
    value?: number;
    label?: string;
    position?: "left" | "right";
};
export declare class Baseline extends React.Component<BaselineProps> {
    static defaultProps: Partial<BaselineProps>;
    render(): JSX.Element;
}
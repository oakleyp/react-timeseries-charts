"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
require("moment-timezone");
var _ = require("lodash");
var React = require("react");
var ReactCSSTransitionGroup = require("react-addons-css-transition-group");
var d3_scale_1 = require("d3-scale");
var Tick_1 = require("./Tick");
var duration_format_1 = require("./util/duration-format");
var time_format_1 = require("./util/time-format");
require("./Axis.css");
var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;
var durationDecade = durationYear * 10;
var majors = {
    "second": "minute",
    "minute": "hour",
    "hour": "day",
    "day": "month",
    "week": "month",
    "month": "year",
    "year": "year"
};
var tickIntervals = [
    [durationSecond, "second", 1],
    [5 * durationSecond, "second", 5],
    [15 * durationSecond, "second", 15],
    [30 * durationSecond, "second", 30],
    [durationMinute, "minute", 1],
    [5 * durationMinute, "minute", 5],
    [15 * durationMinute, "minute", 15],
    [30 * durationMinute, "minute", 30],
    [durationHour, "hour", 1],
    [3 * durationHour, "hour", 3],
    [6 * durationHour, "hour", 6],
    [12 * durationHour, "hour", 12],
    [durationDay, "day", 1],
    [2 * durationDay, "day", 2],
    [3 * durationDay, "day", 3],
    [4 * durationDay, "day", 4],
    [5 * durationDay, "day", 5],
    [durationWeek, "week", 1],
    [durationMonth, "month", 1],
    [3 * durationMonth, "month", 3],
    [durationYear, "year", 1],
    [2 * durationYear, "year", 2],
    [5 * durationYear, "year", 5],
    [durationDecade, "year", 10],
    [25 * durationYear, "year", 25],
    [100 * durationYear, "year", 100],
    [500 * durationYear, "year", 250]
];
var defaultTimeAxisStyle = {
    values: {
        stroke: "none",
        fill: "#8B7E7E",
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    ticks: {
        fill: "none",
        stroke: "#C0C0C0"
    },
    axis: {
        stroke: "#AAA",
        strokeWidth: 1
    },
    label: {
        fill: "grey",
        stroke: "none",
        pointerEvents: "none"
    }
};
var TimeAxis = (function (_super) {
    __extends(TimeAxis, _super);
    function TimeAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeAxis.prototype.renderAxisLabel = function () {
        var _a = this.props, width = _a.width, height = _a.height, position = _a.position, labelPosition = _a.labelPosition, style = _a.style;
        var labelStyle = _.merge(true, defaultTimeAxisStyle.label, this.props.style.label ? this.props.style.label : {});
        var translate;
        var rotate = "rotate(0)";
        var anchor = "start";
        switch (position) {
            case "left":
                translate = "translate(" + (width - labelPosition) + ",5)";
                rotate = "rotate(-90)";
                anchor = "end";
                break;
            case "right":
                translate = "translate(" + labelPosition + ",5)";
                rotate = "rotate(-90)";
                anchor = "end";
                break;
            case "top":
                translate = "translate(5, " + (height - labelPosition) + ")";
                break;
            case "bottom":
                translate = "translate(5, " + labelPosition + ")";
                break;
            default:
        }
        return (React.createElement("g", { transform: translate },
            React.createElement("text", { transform: rotate, textAnchor: anchor, style: labelStyle }, this.props.label)));
    };
    TimeAxis.prototype.renderAxisLine = function () {
        var p = this.props.position;
        var axisStyle = _.merge(true, defaultTimeAxisStyle.axis, this.props.style.axis ? this.props.style.axis : {});
        return (React.createElement("line", { key: "axis", className: "axis", style: axisStyle, x1: this.props.margin, y1: p === "bottom" ? 0 : this.props.height, x2: this.props.width - this.props.margin, y2: p === "bottom" ? 0 : this.props.height }));
    };
    TimeAxis.prototype.renderAxisTicks = function () {
        var formatter = this.props.format;
        var timezone = this.props.timezone;
        var formatAsDuration = this.props.format === "duration";
        if (formatAsDuration) {
            timezone = "Etc/UTC";
        }
        var interval = 5;
        var scale = d3_scale_1.scaleTime()
            .domain([this.props.beginTime, this.props.endTime])
            .range([this.props.margin, this.props.width - this.props.margin * 2]);
        var start = +this.props.beginTime;
        var stop = +this.props.endTime;
        var target = Math.abs(stop - start) / interval;
        var type, num;
        if (_.isString(formatter) && !(formatter == "duration" || formatter == "decade")) {
            type = formatter;
            num = 1;
        }
        else {
            for (var _i = 0, tickIntervals_1 = tickIntervals; _i < tickIntervals_1.length; _i++) {
                var _a = tickIntervals_1[_i], d_1 = _a[0], t = _a[1], n = _a[2];
                if (target < d_1)
                    break;
                type = t;
                num = n;
            }
        }
        if (typeof this.props.format === 'function') {
            formatter = this.props.format;
        }
        else if (formatAsDuration) {
            formatter = duration_format_1.default();
        }
        else {
            formatter = time_format_1.default(type, timezone);
        }
        var starttz = timezone ? moment(start).tz(timezone) : moment(start);
        var stoptz = timezone ? moment(stop).tz(timezone) : moment(stop);
        var startd;
        var stopd;
        if (this.props.format === "decade") {
            startd = starttz.set('year', Math.floor(starttz.year() / 10) * 10);
            stopd = stoptz.set('year', Math.ceil(stoptz.year() / 10) * 10);
        }
        else {
            startd = starttz.startOf(majors[type]).add(num, "type");
            stopd = stoptz.endOf(type);
        }
        var tickStyle = {
            ticks: _.merge(true, defaultTimeAxisStyle.ticks, this.props.style.ticks ? this.props.style.ticks : {}),
            values: _.merge(true, defaultTimeAxisStyle.ticks, this.props.style.values ? this.props.style.values : {})
        };
        var i = 0;
        var d = startd;
        var ticks = [];
        while (d.isBefore(stopd)) {
            var date = d.toDate();
            var pos = scale(date);
            var _b = formatter(date), label = _b.label, size = _b.size, labelAlign = _b.labelAlign;
            if (+d >= start && +d < stop) {
                ticks.push(React.createElement(Tick_1.Tick, { key: +d, id: "" + i, align: this.props.position, label: label, size: size, position: pos, tickExtend: this.props.tickExtend, labelAlign: labelAlign, width: this.props.width, height: this.props.height, smoothTransition: this.props.smoothTransition, angled: this.props.angled, style: tickStyle }));
            }
            d = d.add(num, type);
            i++;
        }
        return ticks;
    };
    TimeAxis.prototype.renderAxis = function () {
        if (this.props.transition === true) {
            return (React.createElement("g", null,
                this.renderAxisLine(),
                React.createElement(ReactCSSTransitionGroup, { component: "g", transitionName: "ticks", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 }, this.renderAxisTicks()),
                this.renderAxisLabel()));
        }
        else {
            return (React.createElement("g", null,
                this.renderAxisLine(),
                this.renderAxisTicks(),
                this.renderAxisLabel()));
        }
    };
    TimeAxis.prototype.render = function () {
        if (this.props.standalone) {
            return (React.createElement("svg", { height: this.props.height, width: this.props.width, style: { shapeRendering: "crispEdges" } }, this.renderAxis()));
        }
        else {
            return this.renderAxis();
        }
    };
    TimeAxis.defaultProps = {
        width: 100,
        height: 100,
        tickCount: 10,
        tickMajor: 20,
        tickMinor: 14,
        tickExtend: 0,
        margin: 10,
        standalone: false,
        labelPosition: 50,
        absolute: false,
        smoothTransition: false,
        angled: false,
        style: defaultTimeAxisStyle
    };
    return TimeAxis;
}(React.Component));
exports.TimeAxis = TimeAxis;
//# sourceMappingURL=TimeAxis.js.map
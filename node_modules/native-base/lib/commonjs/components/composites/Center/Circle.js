"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Center = _interopRequireDefault(require("./Center"));

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Circle = ({
  style,
  size,
  ...props
}, ref) => {
  //TODO: refactor for responsive prop
  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_Center.default, _extends({
    rounded: "full",
    size: size
  }, props, {
    ref: ref,
    height: props.height ? props.height : undefined,
    width: props.width ? props.width : undefined,
    style: style
  }));
};

var _default = /*#__PURE__*/_react.default.memo( /*#__PURE__*/_react.default.forwardRef(Circle));

exports.default = _default;
//# sourceMappingURL=Circle.js.map
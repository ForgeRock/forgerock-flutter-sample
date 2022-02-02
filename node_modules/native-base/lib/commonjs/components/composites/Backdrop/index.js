"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Pressable = require("../../primitives/Pressable");

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Backdrop = props => {
  //TODO: refactor for responsive prop
  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_Pressable.Pressable, _extends({
    _web: {
      cursor: 'default'
    },
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    accessible: false,
    importantForAccessibility: "no",
    bg: props.bg || 'rgb(0, 0, 0)',
    opacity: 0.3
  }, props));
};

var _default = /*#__PURE__*/_react.default.memo(Backdrop);

exports.default = _default;
//# sourceMappingURL=index.js.map
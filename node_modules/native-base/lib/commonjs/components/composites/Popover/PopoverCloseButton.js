"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _hooks = require("../../../hooks");

var _Box = _interopRequireDefault(require("../../primitives/Box"));

var _IconButton = _interopRequireDefault(require("../IconButton"));

var _Icons = require("../../primitives/Icon/Icons");

var _PopoverContext = require("./PopoverContext");

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const PopoverCloseButton = (props, ref) => {
  const {
    onClose
  } = _react.default.useContext(_PopoverContext.PopoverContext);

  const {
    _icon,
    ...resolvedPorps
  } = (0, _hooks.usePropsResolution)('PopoverCloseButton', props); //TODO: refactor for responsive prop

  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_Box.default, {
    position: "absolute",
    right: 1,
    top: 1,
    zIndex: 1,
    ref: ref
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, _extends({}, resolvedPorps, {
    icon: /*#__PURE__*/_react.default.createElement(_Icons.CloseIcon, _icon),
    onPress: onClose
  })));
};

var _default = /*#__PURE__*/_react.default.memo( /*#__PURE__*/_react.default.forwardRef(PopoverCloseButton));

exports.default = _default;
//# sourceMappingURL=PopoverCloseButton.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hooks = require("../../../hooks");

var _react = _interopRequireDefault(require("react"));

var _Box = _interopRequireDefault(require("../../primitives/Box"));

var _PopoverContext = require("./PopoverContext");

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const PopoverBody = (props, ref) => {
  const resolvedProps = (0, _hooks.usePropsResolution)('PopoverBody', props);

  const {
    setBodyMounted,
    bodyId
  } = _react.default.useContext(_PopoverContext.PopoverContext);

  _react.default.useEffect(() => {
    setBodyMounted(true);
    return () => {
      setBodyMounted(false);
    };
  }, [setBodyMounted]); //TODO: refactor for responsive prop


  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_Box.default, _extends({
    nativeID: bodyId
  }, resolvedProps, props, {
    ref: ref
  }));
};

var _default = /*#__PURE__*/_react.default.memo( /*#__PURE__*/_react.default.forwardRef(PopoverBody));

exports.default = _default;
//# sourceMappingURL=PopoverBody.js.map
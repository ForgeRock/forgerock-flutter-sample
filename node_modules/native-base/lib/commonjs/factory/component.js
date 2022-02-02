"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Factory;

var _react = _interopRequireDefault(require("react"));

var _usePropsWithComponentTheme = require("../hooks/useThemeProps/usePropsWithComponentTheme");

var _styled = require("../utils/styled");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function Factory(Component, componentTheme) {
  return /*#__PURE__*/_react.default.forwardRef(({
    children,
    ...props
  }, ref) => {
    const StyledComponent = (0, _styled.makeStyledComponent)(Component);
    const calculatedProps = (0, _usePropsWithComponentTheme.usePropsWithComponentTheme)(componentTheme !== null && componentTheme !== void 0 ? componentTheme : {}, props);
    return /*#__PURE__*/_react.default.createElement(StyledComponent, _extends({}, calculatedProps, {
      ref: ref
    }), children);
  });
}
//# sourceMappingURL=component.js.map
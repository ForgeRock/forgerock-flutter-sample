"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _useThemeProps = require("../../../hooks/useThemeProps");

var _PresenceTransition = _interopRequireDefault(require("./PresenceTransition"));

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ScaleFade = ({
  children,
  style,
  ...props
}, ref) => {
  const {
    in: animationState,
    duration,
    initialScale
  } = (0, _useThemeProps.useThemeProps)('ScaleFade', props); //TODO: refactor for responsive prop

  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_PresenceTransition.default, {
    initial: {
      opacity: 0,
      scale: initialScale
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration
      }
    },
    exit: {
      opacity: 0,
      scale: initialScale,
      transition: {
        duration
      }
    },
    style: style,
    visible: animationState,
    ref: ref
  }, children);
};

var _default = /*#__PURE__*/_react.default.memo( /*#__PURE__*/_react.default.forwardRef(ScaleFade));

exports.default = _default;
//# sourceMappingURL=ScaleFade.js.map
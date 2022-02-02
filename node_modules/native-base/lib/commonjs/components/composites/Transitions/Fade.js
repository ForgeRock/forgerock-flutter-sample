"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _useThemeProps = require("../../../hooks/useThemeProps");

var _PresenceTransition = _interopRequireDefault(require("../Transitions/PresenceTransition"));

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Fade = ({
  children,
  style,
  ...props
}, ref) => {
  const {
    in: animationState,
    entryDuration,
    exitDuration
  } = (0, _useThemeProps.useThemeProps)('Fade', props); //TODO: refactor for responsive prop

  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_PresenceTransition.default, {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        duration: entryDuration
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: exitDuration
      }
    },
    style: style,
    visible: animationState,
    ref: ref
  }, children);
};

var _default = /*#__PURE__*/_react.default.memo( /*#__PURE__*/_react.default.forwardRef(Fade));

exports.default = _default;
//# sourceMappingURL=Fade.js.map
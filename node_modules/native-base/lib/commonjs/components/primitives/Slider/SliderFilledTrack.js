"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Context = require("./Context");

var _reactNative = require("react-native");

var _Box = _interopRequireDefault(require("../Box"));

var _useThemeProps = require("../../../hooks/useThemeProps");

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const SliderFilledTrack = ({
  style,
  ...props
}, ref) => {
  const {
    isReversed,
    colorScheme,
    state,
    trackLayout,
    orientation,
    isDisabled,
    sliderSize,
    isReadOnly
  } = _react.default.useContext(_Context.SliderContext);

  const sliderTrackPosition = isReversed ? orientation === 'vertical' ? trackLayout.height - trackLayout.height * state.getThumbPercent(0) : trackLayout.width - trackLayout.width * state.getThumbPercent(0) : state.getThumbPercent(0) * 100 + '%';
  const resolvedProps = (0, _useThemeProps.usePropsResolution)('SliderFilledTrack', {
    size: sliderSize,
    colorScheme,
    ...props
  }, {
    isDisabled,
    isReadOnly
  }); // NOTE: Required for WEB compatibility

  const customStyle = _reactNative.StyleSheet.create({
    verticalStyle: {
      height: sliderTrackPosition,
      width: sliderSize
    },
    horizontalStyle: {
      width: sliderTrackPosition,
      height: sliderSize
    }
  }); //TODO: refactor for responsive prop


  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_Box.default, _extends({
    position: "absolute"
  }, resolvedProps, {
    left: orientation !== 'vertical' && !isReversed ? 0 : undefined,
    bottom: orientation === 'vertical' && !isReversed ? 0 : undefined,
    right: orientation !== 'vertical' && isReversed ? 0 : undefined,
    top: orientation === 'vertical' && isReversed ? 0 : undefined,
    style: [style, orientation === 'vertical' ? customStyle.verticalStyle : customStyle.horizontalStyle],
    ref: ref // {...(isReadOnly && _readOnly)}
    // {...(isDisabled && _disabled)}

  }));
};

var _default = /*#__PURE__*/_react.default.forwardRef(SliderFilledTrack);

exports.default = _default;
//# sourceMappingURL=SliderFilledTrack.js.map
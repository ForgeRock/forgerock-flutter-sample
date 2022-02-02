"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slider = exports.SliderFilledTrack = exports.SliderThumb = exports.SliderTrack = void 0;

var _tools = require("../tools");

const SliderTrack = {
  baseStyle: props => {
    const simplifiedColorScheme = (0, _tools.getColorScheme)(props);
    return {
      bg: "".concat(simplifiedColorScheme, ".100"),
      borderRadius: 'lg',
      overflow: 'hidden'
    };
  }
};
exports.SliderTrack = SliderTrack;
const SliderThumb = {
  baseStyle: props => {
    const simplifiedColorScheme = (0, _tools.getColorScheme)(props);
    return {
      borderRadius: 99999,
      zIndex: 999,
      alignItems: 'center',
      justifyContent: 'center',
      bg: (0, _tools.mode)("".concat(simplifiedColorScheme, ".600"), "".concat(simplifiedColorScheme, ".300"))(props),
      scaleOnPressed: 1.2
    };
  }
};
exports.SliderThumb = SliderThumb;
const SliderFilledTrack = {
  baseStyle: props => {
    const simplifiedColorScheme = (0, _tools.getColorScheme)(props);
    return {
      bg: (0, _tools.mode)("".concat(simplifiedColorScheme, ".600"), "".concat(simplifiedColorScheme, ".300"))(props)
    };
  }
};
exports.SliderFilledTrack = SliderFilledTrack;
const sizes = {
  lg: {
    thumbSize: 6,
    sliderSize: 6
  },
  md: {
    thumbSize: 5,
    sliderSize: 5
  },
  sm: {
    thumbSize: 4,
    sliderSize: 4
  }
};
const Slider = {
  defaultProps: {
    size: 'sm'
  },
  sizes
};
exports.Slider = Slider;
//# sourceMappingURL=slider.js.map
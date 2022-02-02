"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlideFade = exports.Slide = exports.ScaleFade = exports.Fade = void 0;
//Fade
const fadeDefaultProps = {
  entryDuration: 500,
  exitDuration: 500
};
const Fade = {
  defaultProps: fadeDefaultProps
}; //ScaleFade

exports.Fade = Fade;
const scaleFadeDefaultProps = {
  duration: 500,
  initialScale: 0.9
};
const ScaleFade = {
  defaultProps: scaleFadeDefaultProps
}; //Slide

exports.ScaleFade = ScaleFade;
const slideDefaultProps = {
  duration: 500,
  placement: 'bottom',
  overlay: true
};
const Slide = {
  defaultProps: slideDefaultProps
}; //SlideFade

exports.Slide = Slide;
const slideFadeDefaultProps = {
  duration: 500,
  offsetX: 10,
  offsetY: 10
};
const SlideFade = {
  defaultProps: slideFadeDefaultProps
};
exports.SlideFade = SlideFade;
//# sourceMappingURL=transitions.js.map
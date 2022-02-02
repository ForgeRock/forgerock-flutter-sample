"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChevronUpIcon = exports.ChevronRightIcon = exports.ChevronLeftIcon = exports.ChevronDownIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _createIcon = require("../createIcon");

var _nbSvg = require("../nbSvg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ChevronDownIcon = (0, _createIcon.createIcon)({
  viewBox: '0 0 24 24',
  path: [/*#__PURE__*/_react.default.createElement(_nbSvg.G, {
    transform: "translate(24) rotate(90)"
  }, /*#__PURE__*/_react.default.createElement(_nbSvg.Path, {
    d: "M0,0H24V24H0Z",
    fill: "none"
  }), /*#__PURE__*/_react.default.createElement(_nbSvg.Path, {
    d: "M10,6,8.59,7.41,13.17,12,8.59,16.59,10,18l6-6Z"
  }))]
});
exports.ChevronDownIcon = ChevronDownIcon;
const ChevronLeftIcon = (0, _createIcon.createIcon)({
  viewBox: '0 0 24 24',
  d: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'
});
exports.ChevronLeftIcon = ChevronLeftIcon;
const ChevronRightIcon = (0, _createIcon.createIcon)({
  viewBox: '0 0 24 24',
  d: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'
});
exports.ChevronRightIcon = ChevronRightIcon;
const ChevronUpIcon = (0, _createIcon.createIcon)({
  viewBox: '0 0 24 24',
  d: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'
});
exports.ChevronUpIcon = ChevronUpIcon;
//# sourceMappingURL=Chevron.js.map
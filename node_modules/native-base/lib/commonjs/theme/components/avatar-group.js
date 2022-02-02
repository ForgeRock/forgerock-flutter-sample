"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tools = require("../tools");

function baseStyle(props) {
  return {
    borderWidth: 2,
    borderColor: (0, _tools.mode)('gray.50', 'gray.800')(props),
    bg: (0, _tools.mode)('gray.600', 'gray.100')(props),
    space: -4
  };
}

var _default = {
  baseStyle
};
exports.default = _default;
//# sourceMappingURL=avatar-group.js.map
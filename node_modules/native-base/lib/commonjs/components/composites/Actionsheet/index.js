"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Actionsheet = void 0;

var _Actionsheet = _interopRequireDefault(require("./Actionsheet"));

var _ActionsheetItem = _interopRequireDefault(require("./ActionsheetItem"));

var _ActionsheetHeader = _interopRequireDefault(require("./ActionsheetHeader"));

var _ActionsheetFooter = _interopRequireDefault(require("./ActionsheetFooter"));

var _ActionsheetContent = _interopRequireDefault(require("./ActionsheetContent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ActionsheetTemp = _Actionsheet.default;
ActionsheetTemp.Content = _ActionsheetContent.default;
ActionsheetTemp.Item = _ActionsheetItem.default;
ActionsheetTemp.Header = _ActionsheetHeader.default;
ActionsheetTemp.Footer = _ActionsheetFooter.default; // To add typings

const Actionsheet = ActionsheetTemp;
exports.Actionsheet = Actionsheet;
//# sourceMappingURL=index.js.map
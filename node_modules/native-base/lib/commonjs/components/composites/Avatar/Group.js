"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Flex = _interopRequireDefault(require("../../primitives/Flex"));

var _useThemeProps = require("../../../hooks/useThemeProps");

var _lodash = _interopRequireDefault(require("lodash.isnil"));

var _Avatar = _interopRequireDefault(require("./Avatar"));

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Todo: Try using HStack instead
const getAvatarGroupChildren = (children, space, max, plusAvatarBg, props) => {
  let childrenArray = _react.default.Children.toArray(children);

  let plusAvatars = 0;

  if (!(0, _lodash.default)(max) && max < childrenArray.length && max > 0) {
    plusAvatars = childrenArray.length - max;
    childrenArray = childrenArray.slice(0, max);
  }

  const trailingChildren = childrenArray.slice(1);
  const defaultProps = {
    ml: space
  };
  return [plusAvatars > 0 ? /*#__PURE__*/_react.default.createElement(_Avatar.default, _extends({
    bg: plusAvatarBg
  }, defaultProps, props), '+ ' + plusAvatars) : null, _react.default.Children.map(trailingChildren.reverse(), (child, index) => {
    return /*#__PURE__*/_react.default.cloneElement(child, {
      key: "avatar-group-child-".concat(index),
      ...props,
      ...defaultProps,
      ...child.props
    }, child.props.children);
  }), /*#__PURE__*/_react.default.cloneElement(childrenArray[0], { ...props,
    ...childrenArray[0].props
  }, childrenArray[0].props.children)];
};

const AvatarGroup = (allProps, ref) => {
  const {
    children,
    ...props
  } = allProps;
  const {
    borderColor,
    borderWidth,
    bg,
    space,
    max
  } = (0, _useThemeProps.usePropsResolution)('AvatarGroup', props); //TODO: refactor for responsive prop

  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_Flex.default, {
    flexDirection: "row-reverse",
    ref: ref
  }, getAvatarGroupChildren(children, space, max, bg, {
    borderColor,
    borderWidth,
    ...props
  }));
};

var _default = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(AvatarGroup));

exports.default = _default;
//# sourceMappingURL=Group.js.map
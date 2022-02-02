"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _primitives = require("../../primitives");

var _useThemeProps = require("../../../hooks/useThemeProps");

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Avatar = ({
  children,
  ...props
}, ref) => {
  const [error, setError] = _react.default.useState(false);

  const {
    _text,
    source,
    style,
    ...resolvedProps
  } = (0, _useThemeProps.usePropsResolution)('Avatar', props);

  let Badge = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);

  const remainingChildren = []; //  Pop Badge from children

  _react.default.Children.map(children, (child, key) => {
    if (typeof (child === null || child === void 0 ? void 0 : child.type) === 'object' && (child === null || child === void 0 ? void 0 : child.type.displayName) === 'AvatarBadge') {
      Badge = child;
    } else {
      remainingChildren.push(typeof child === 'string' || typeof child === 'number' ? /*#__PURE__*/_react.default.createElement(_primitives.Text, _extends({
        key: 'avatar-children-' + key
      }, _text), child) : child);
    }
  });

  const imageFitStyle = {
    height: '100%',
    width: '100%'
  }; //TODO: refactor for responsive prop

  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(props)) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_primitives.Box, resolvedProps, source && !error ? /*#__PURE__*/_react.default.createElement(_primitives.Image, {
    borderRadius: resolvedProps.borderRadius,
    source: source,
    alt: '--',
    _alt: _text,
    style: [style, imageFitStyle],
    onError: () => {
      setError(true);
    },
    ref: ref
  }) : remainingChildren.length !== 0 && remainingChildren, Badge);
};

var _default = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(Avatar));

exports.default = _default;
//# sourceMappingURL=Avatar.js.map
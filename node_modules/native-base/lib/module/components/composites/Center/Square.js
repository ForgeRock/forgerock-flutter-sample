function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import Center from './Center';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const Square = ({
  style,
  size,
  ...props
}) => {
  //TODO: refactor for responsive prop
  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Center, _extends({
    size: size
  }, props, {
    height: props.height ? props.height : undefined,
    width: props.width ? props.width : undefined,
    style: style
  }));
};

export default /*#__PURE__*/React.memo(Square);
//# sourceMappingURL=Square.js.map
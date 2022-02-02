function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, forwardRef } from 'react';
import { getAttachedChildren } from '../../../utils';
import { HStack } from '../Stack';
import { extractInObject, stylingProps } from '../../../theme/tools/utils';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const supplyPropsToChildren = (children, props) => {
  return React.Children.map(children, child => {
    return /*#__PURE__*/React.cloneElement(child, props, child.props.children);
  });
};

export const InputGroup = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(({
  children,
  ...props
}, ref) => {
  const [layoutProps, nonLayoutProps] = extractInObject(props, [...stylingProps.margin, ...stylingProps.border, ...stylingProps.layout, ...stylingProps.flexbox, ...stylingProps.position, ...stylingProps.background, 'space', 'shadow', 'opacity']); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(HStack, _extends({}, layoutProps, {
    ref: ref
  }), supplyPropsToChildren(getAttachedChildren(children), nonLayoutProps));
}));
//# sourceMappingURL=InputGroup.js.map
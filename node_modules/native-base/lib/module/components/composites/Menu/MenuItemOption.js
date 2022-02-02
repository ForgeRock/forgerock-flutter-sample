function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef, memo } from 'react';
import { CheckIcon } from '../../primitives/Icon/Icons';
import Box from '../../primitives/Box';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import MenuItem from './MenuItem';
import { MenuOptionContext } from './MenuOptionGroup';
import { useMenuOptionItem } from './useMenu';
import { HStack } from '../../primitives/Stack';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const MenuItemOption = (props, ref) => {
  const {
    value,
    children,
    onPress,
    ...resolvedProps
  } = usePropsResolution('MenuItem', props);
  const {
    values,
    onChange,
    type
  } = React.useContext(MenuOptionContext);

  const modifiedOnPress = e => {
    onChange(value);
    onPress && onPress(e);
  };

  const isChecked = values.includes(value);
  const menuOptionProps = useMenuOptionItem({
    isChecked,
    type
  }); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(MenuItem, _extends({}, resolvedProps, menuOptionProps, {
    accessibilityRole: "button",
    onPress: modifiedOnPress,
    ref: ref
  }), /*#__PURE__*/React.createElement(HStack, {
    alignItems: "center",
    px: resolvedProps.px,
    space: 3
  }, /*#__PURE__*/React.createElement(CheckIcon, _extends({}, resolvedProps._icon, {
    opacity: isChecked ? 1 : 0
  })), /*#__PURE__*/React.createElement(Box, null, children)));
};

export default /*#__PURE__*/memo( /*#__PURE__*/forwardRef(MenuItemOption));
//# sourceMappingURL=MenuItemOption.js.map
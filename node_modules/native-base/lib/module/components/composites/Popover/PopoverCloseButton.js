function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { usePropsResolution } from '../../../hooks';
import Box from '../../primitives/Box';
import { default as IconButton } from '../IconButton';
import { CloseIcon } from '../../primitives/Icon/Icons';
import { PopoverContext } from './PopoverContext';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const PopoverCloseButton = (props, ref) => {
  const {
    onClose
  } = React.useContext(PopoverContext);
  const {
    _icon,
    ...resolvedPorps
  } = usePropsResolution('PopoverCloseButton', props); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Box, {
    position: "absolute",
    right: 1,
    top: 1,
    zIndex: 1,
    ref: ref
  }, /*#__PURE__*/React.createElement(IconButton, _extends({}, resolvedPorps, {
    icon: /*#__PURE__*/React.createElement(CloseIcon, _icon),
    onPress: onClose
  })));
};

export default /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(PopoverCloseButton));
//# sourceMappingURL=PopoverCloseButton.js.map
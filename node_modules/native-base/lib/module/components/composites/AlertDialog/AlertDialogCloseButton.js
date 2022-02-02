function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, forwardRef } from 'react';
import { AlertDialogContext } from './Context';
import { usePropsResolution } from '../../../hooks';
import Button from '../../primitives/Button/Button';
import { CloseIcon } from '../../primitives/Icon/Icons';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const AlertDialogCloseButton = (props, ref) => {
  const newProps = usePropsResolution('AlertDialogCloseButton', props);
  const {
    _icon,
    ...rest
  } = newProps;
  const {
    handleClose
  } = React.useContext(AlertDialogContext); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Button, _extends({
    variant: "ghost"
  }, rest, {
    onPress: handleClose,
    accessibilityLabel: "Close dialog",
    ref: ref
  }), /*#__PURE__*/React.createElement(CloseIcon, _icon));
};

export default /*#__PURE__*/memo( /*#__PURE__*/forwardRef(AlertDialogCloseButton));
//# sourceMappingURL=AlertDialogCloseButton.js.map
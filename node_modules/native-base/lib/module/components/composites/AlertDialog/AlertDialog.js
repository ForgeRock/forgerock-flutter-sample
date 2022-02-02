function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef, memo } from 'react';
import { StyleSheet } from 'react-native';
import Backdrop from '../Backdrop';
import { Slide } from '../Transitions';
import { FocusScope } from '@react-native-aria/focus';
import { useControllableState, usePropsResolution } from '../../../hooks';
import { AlertDialogContext } from './Context';
import Box from '../../primitives/Box';
import { Fade } from '../Transitions';
import { useKeyboardBottomInset } from '../../../utils';
import { Overlay } from '../../primitives/Overlay';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const AlertDialog = ({
  children,
  isOpen,
  onClose,
  defaultIsOpen,
  initialFocusRef,
  finalFocusRef,
  avoidKeyboard,
  closeOnOverlayClick = false,
  isKeyboardDismissable = true,
  overlayVisible = true,
  backdropVisible = true,
  //@ts-ignore - internal purpose only
  animationPreset = 'fade',
  ...rest
}, ref) => {
  const bottomInset = useKeyboardBottomInset();
  const {
    contentSize,
    _backdrop,
    ...restThemeProps
  } = usePropsResolution('AlertDialog', rest);
  const [visible, setVisible] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: val => {
      if (!val) onClose && onClose();
    }
  });

  const handleClose = () => setVisible(false);

  let child = /*#__PURE__*/React.createElement(Box, _extends({
    bottom: avoidKeyboard ? bottomInset + 'px' : undefined
  }, restThemeProps, {
    ref: ref,
    pointerEvents: "box-none"
  }), children); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(rest)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Overlay, {
    isOpen: visible,
    onRequestClose: handleClose,
    isKeyboardDismissable: isKeyboardDismissable,
    useRNModalOnAndroid: true
  }, /*#__PURE__*/React.createElement(AlertDialogContext.Provider, {
    value: {
      handleClose,
      contentSize,
      initialFocusRef,
      finalFocusRef
    }
  }, /*#__PURE__*/React.createElement(Fade, {
    exitDuration: 150,
    entryDuration: 200,
    in: visible,
    style: StyleSheet.absoluteFill
  }, overlayVisible && backdropVisible && /*#__PURE__*/React.createElement(Backdrop, _extends({
    onPress: () => {
      closeOnOverlayClick && handleClose();
    }
  }, _backdrop))), animationPreset === 'slide' ? /*#__PURE__*/React.createElement(Slide, {
    overlay: false,
    in: visible,
    duration: 200
  }, /*#__PURE__*/React.createElement(FocusScope, {
    contain: visible,
    autoFocus: visible && !initialFocusRef,
    restoreFocus: visible && !finalFocusRef
  }, child)) : /*#__PURE__*/React.createElement(Fade, {
    exitDuration: 100,
    entryDuration: 200,
    in: visible,
    style: StyleSheet.absoluteFill
  }, /*#__PURE__*/React.createElement(FocusScope, {
    contain: visible,
    autoFocus: visible && !initialFocusRef,
    restoreFocus: visible && !finalFocusRef
  }, child))));
};

export default /*#__PURE__*/memo( /*#__PURE__*/forwardRef(AlertDialog));
//# sourceMappingURL=AlertDialog.js.map
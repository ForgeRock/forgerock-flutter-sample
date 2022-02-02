"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _Backdrop = _interopRequireDefault(require("../Backdrop"));

var _Transitions = require("../Transitions");

var _focus = require("@react-native-aria/focus");

var _hooks = require("../../../hooks");

var _Context = require("./Context");

var _Box = _interopRequireDefault(require("../../primitives/Box"));

var _Transitions2 = require("../../composites/Transitions");

var _utils = require("../../../utils");

var _Overlay = require("../../primitives/Overlay");

var _useHasResponsiveProps = require("../../../hooks/useHasResponsiveProps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Modal = ({
  children,
  isOpen,
  onClose,
  defaultIsOpen,
  initialFocusRef,
  finalFocusRef,
  avoidKeyboard,
  closeOnOverlayClick = true,
  isKeyboardDismissable = true,
  overlayVisible = true,
  backdropVisible = true,
  //@ts-ignore - internal purpose only
  animationPreset = 'fade',
  ...rest
}, ref) => {
  const bottomInset = (0, _utils.useKeyboardBottomInset)();
  const {
    contentSize,
    _backdrop,
    ...resolvedProps
  } = (0, _hooks.usePropsResolution)('Modal', rest);
  const [visible, setVisible] = (0, _hooks.useControllableState)({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: val => {
      if (!val) onClose && onClose();
    }
  });

  const handleClose = _react.default.useCallback(() => setVisible(false), [setVisible]);

  const child = /*#__PURE__*/_react.default.createElement(_Box.default, _extends({
    bottom: avoidKeyboard ? bottomInset + 'px' : undefined
  }, resolvedProps, {
    ref: ref,
    pointerEvents: "box-none"
  }), children);

  const contextValue = _react.default.useMemo(() => {
    return {
      handleClose,
      contentSize,
      initialFocusRef,
      finalFocusRef,
      visible
    };
  }, [handleClose, contentSize, initialFocusRef, finalFocusRef, visible]); //TODO: refactor for responsive prop


  if ((0, _useHasResponsiveProps.useHasResponsiveProps)(rest)) {
    return null;
  } // console.log('visible here', visible);


  return /*#__PURE__*/_react.default.createElement(_Overlay.Overlay, {
    isOpen: visible,
    onRequestClose: handleClose,
    isKeyboardDismissable: isKeyboardDismissable,
    animationPreset: animationPreset,
    useRNModalOnAndroid: true
  }, /*#__PURE__*/_react.default.createElement(_Context.ModalContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/_react.default.createElement(_Transitions2.Fade, {
    exitDuration: 150,
    entryDuration: 200,
    in: visible,
    style: _reactNative.StyleSheet.absoluteFill
  }, overlayVisible && backdropVisible && /*#__PURE__*/_react.default.createElement(_Backdrop.default, _extends({
    onPress: () => {
      closeOnOverlayClick && handleClose();
    }
  }, _backdrop))), animationPreset === 'slide' ? /*#__PURE__*/_react.default.createElement(_Transitions.Slide, {
    in: visible,
    overlay: false,
    duration: 200
  }, /*#__PURE__*/_react.default.createElement(_focus.FocusScope, {
    contain: visible,
    autoFocus: visible && !initialFocusRef,
    restoreFocus: visible && !finalFocusRef
  }, child)) : /*#__PURE__*/_react.default.createElement(_Transitions2.Fade, {
    exitDuration: 100,
    entryDuration: 200,
    in: visible,
    style: _reactNative.StyleSheet.absoluteFill
  }, /*#__PURE__*/_react.default.createElement(_focus.FocusScope, {
    contain: visible,
    autoFocus: visible && !initialFocusRef,
    restoreFocus: visible && !finalFocusRef
  }, child))));
};

var _default = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(Modal));

exports.default = _default;
//# sourceMappingURL=Modal.js.map
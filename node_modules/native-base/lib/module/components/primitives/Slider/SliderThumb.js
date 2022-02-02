function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef } from 'react';
import { Platform } from 'react-native';
import { useSliderThumb } from '@react-native-aria/slider';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useToken } from '../../../hooks';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import Box from '../Box';
import { SliderContext } from './Context';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

function SliderThumb(props, ref) {
  const {
    state,
    trackLayout,
    orientation,
    colorScheme,
    thumbSize,
    isReadOnly,
    isDisabled
  } = React.useContext(SliderContext);
  const resolvedProps = usePropsResolution('SliderThumb', {
    size: thumbSize,
    colorScheme,
    ...props
  }, {
    isDisabled,
    isReadOnly
  });
  const inputRef = React.useRef(null);
  const {
    thumbProps,
    inputProps
  } = useSliderThumb({
    index: 0,
    trackLayout,
    inputRef,
    orientation
  }, state);
  const thumbAbsoluteSize = useToken('sizes', resolvedProps.size);
  const thumbStyles = {
    bottom: orientation === 'vertical' ? "".concat(state.getThumbPercent(0) * 100, "%") : undefined,
    left: orientation !== 'vertical' ? "".concat(state.getThumbPercent(0) * 100, "%") : undefined,
    transform: orientation === 'vertical' ? [{
      translateY: parseInt(thumbAbsoluteSize) / 2
    }] : [{
      translateX: -parseInt(thumbAbsoluteSize) / 2
    }]
  };
  thumbStyles.transform.push({
    scale: state.isThumbDragging(0) ? resolvedProps.scaleOnPressed : 1
  }); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Box, _extends({
    position: "absolute"
  }, thumbProps, resolvedProps, {
    ref: ref,
    style: [thumbStyles, props.style] // {...(isReadOnly && _readOnly)}
    // {...(isDisabled && _disabled)}

  }), props.children, Platform.OS === 'web' && /*#__PURE__*/React.createElement(VisuallyHidden, null, /*#__PURE__*/React.createElement("input", _extends({
    ref: inputRef
  }, inputProps))));
}

SliderThumb.displayName = 'SliderThumb';
export default /*#__PURE__*/forwardRef(SliderThumb);
//# sourceMappingURL=SliderThumb.js.map
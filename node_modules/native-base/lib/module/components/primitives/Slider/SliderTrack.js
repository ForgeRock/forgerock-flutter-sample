function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import { Pressable } from '../Pressable';
import Box from '../Box';
import { SliderContext } from './Context';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const SliderTrack = ({
  children,
  ...props
}, ref) => {
  const {
    orientation,
    trackProps,
    onTrackLayout,
    colorScheme,
    sliderSize,
    isReadOnly,
    isDisabled
  } = React.useContext(SliderContext);
  const resolvedProps = usePropsResolution('SliderTrack', {
    size: sliderSize,
    colorScheme,
    ...props
  }, {
    isReadOnly,
    isDisabled
  });
  const isVertical = orientation === 'vertical';
  const trackStyle = React.useMemo(() => ({
    height: isVertical ? '100%' : resolvedProps.size,
    width: !isVertical ? '100%' : resolvedProps.size
  }), [isVertical, resolvedProps.size]); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Pressable, _extends({
    onLayout: onTrackLayout,
    ref: ref
  }, trackProps, trackStyle, {
    paddingY: !isVertical ? '12px' : undefined,
    paddingX: isVertical ? '12px' : undefined,
    justifyContent: "center",
    alignItems: "center"
  }), /*#__PURE__*/React.createElement(Box, _extends({}, resolvedProps, {
    style: trackStyle
  }), children));
};

export default /*#__PURE__*/React.forwardRef(SliderTrack);
//# sourceMappingURL=SliderTrack.js.map
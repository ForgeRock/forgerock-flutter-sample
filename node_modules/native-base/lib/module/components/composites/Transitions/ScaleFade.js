import React from 'react';
import { useThemeProps } from '../../../hooks/useThemeProps';
import PresenceTransition from './PresenceTransition';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const ScaleFade = ({
  children,
  style,
  ...props
}, ref) => {
  const {
    in: animationState,
    duration,
    initialScale
  } = useThemeProps('ScaleFade', props); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(PresenceTransition, {
    initial: {
      opacity: 0,
      scale: initialScale
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration
      }
    },
    exit: {
      opacity: 0,
      scale: initialScale,
      transition: {
        duration
      }
    },
    style: style,
    visible: animationState,
    ref: ref
  }, children);
};

export default /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(ScaleFade));
//# sourceMappingURL=ScaleFade.js.map
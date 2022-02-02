import React from 'react';
import { useThemeProps } from '../../../hooks/useThemeProps';
import PresenceTransition from '../Transitions/PresenceTransition';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const Fade = ({
  children,
  style,
  ...props
}, ref) => {
  const {
    in: animationState,
    entryDuration,
    exitDuration
  } = useThemeProps('Fade', props); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(PresenceTransition, {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        duration: entryDuration
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: exitDuration
      }
    },
    style: style,
    visible: animationState,
    ref: ref
  }, children);
};

export default /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(Fade));
//# sourceMappingURL=Fade.js.map
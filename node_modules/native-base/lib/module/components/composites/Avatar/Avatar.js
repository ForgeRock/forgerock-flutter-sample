function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, forwardRef } from 'react';
import { Box, Image, Text } from '../../primitives';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const Avatar = ({
  children,
  ...props
}, ref) => {
  const [error, setError] = React.useState(false);
  const {
    _text,
    source,
    style,
    ...resolvedProps
  } = usePropsResolution('Avatar', props);
  let Badge = /*#__PURE__*/React.createElement(React.Fragment, null);
  const remainingChildren = []; //  Pop Badge from children

  React.Children.map(children, (child, key) => {
    if (typeof (child === null || child === void 0 ? void 0 : child.type) === 'object' && (child === null || child === void 0 ? void 0 : child.type.displayName) === 'AvatarBadge') {
      Badge = child;
    } else {
      remainingChildren.push(typeof child === 'string' || typeof child === 'number' ? /*#__PURE__*/React.createElement(Text, _extends({
        key: 'avatar-children-' + key
      }, _text), child) : child);
    }
  });
  const imageFitStyle = {
    height: '100%',
    width: '100%'
  }; //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Box, resolvedProps, source && !error ? /*#__PURE__*/React.createElement(Image, {
    borderRadius: resolvedProps.borderRadius,
    source: source,
    alt: '--',
    _alt: _text,
    style: [style, imageFitStyle],
    onError: () => {
      setError(true);
    },
    ref: ref
  }) : remainingChildren.length !== 0 && remainingChildren, Badge);
};

export default /*#__PURE__*/memo( /*#__PURE__*/forwardRef(Avatar));
//# sourceMappingURL=Avatar.js.map
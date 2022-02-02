function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { usePropsResolution } from '../../../hooks';
import React from 'react';
import { default as Box } from '../../primitives/Box';
import { PopoverContext } from './PopoverContext';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const PopoverBody = (props, ref) => {
  const resolvedProps = usePropsResolution('PopoverBody', props);
  const {
    setBodyMounted,
    bodyId
  } = React.useContext(PopoverContext);
  React.useEffect(() => {
    setBodyMounted(true);
    return () => {
      setBodyMounted(false);
    };
  }, [setBodyMounted]); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Box, _extends({
    nativeID: bodyId
  }, resolvedProps, props, {
    ref: ref
  }));
};

export default /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(PopoverBody));
//# sourceMappingURL=PopoverBody.js.map
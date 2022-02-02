function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, forwardRef } from 'react';
import Box from '../../primitives/Box';
import { usePropsResolution } from '../../../hooks';
import { ScrollView } from 'react-native';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const AlertDialogBody = (props, ref) => {
  const newProps = usePropsResolution('AlertDialogBody', props); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(ScrollView, null, /*#__PURE__*/React.createElement(Box, _extends({}, newProps, {
    ref: ref
  }), props.children));
};

export default /*#__PURE__*/memo( /*#__PURE__*/forwardRef(AlertDialogBody));
//# sourceMappingURL=AlertDialogBody.js.map
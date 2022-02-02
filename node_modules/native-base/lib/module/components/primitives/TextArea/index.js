function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, forwardRef } from 'react';
import { Input } from '../Input';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const TextArea = ({
  wrapperRef,
  ...props
}, ref) => {
  const {
    totalLines,
    ...newProps
  } = usePropsResolution('TextArea', props); //TODO: refactor for responsive prop

  if (useHasResponsiveProps(props)) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Input, _extends({}, newProps, {
    numberOfLines: totalLines,
    wrapperRef: wrapperRef,
    ref: ref
  }));
};

export default /*#__PURE__*/memo( /*#__PURE__*/forwardRef(TextArea));
//# sourceMappingURL=index.js.map
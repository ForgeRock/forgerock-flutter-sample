function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, forwardRef } from 'react';
import Box from '../../primitives/Box';
import Text from '../../primitives/Text';
import { useFormControlContext } from './useFormControl';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import { mergeRefs } from '../../../utils';
import { combineContextAndProps } from '../../../utils';

const FormControlLabel = ({
  children,
  ...props
}, ref) => {
  const formControlContext = useFormControlContext();
  const combinedProps = combineContextAndProps(formControlContext, props);

  const _ref = React.useRef(null);

  const {
    astrickColor,
    ...reslovedProps
  } = usePropsResolution('FormControlLabel', combinedProps, {
    isDisabled: combinedProps.isDisabled,
    isReadOnly: combinedProps.isReadOnly,
    isInvalid: combinedProps.isInvalid // isRequired: combinedProps.isRequired,

  });

  const requiredAsterisk = () => /*#__PURE__*/React.createElement(Text, {
    _web: {
      accessibilityHidden: true,
      //@ts-ignore
      accessibilityRole: 'presentation'
    },
    color: astrickColor
  }, "*");

  const mergedRef = mergeRefs([_ref, ref]);
  React.useEffect(() => {
    if (_ref.current) {
      // RN web doesn't support htmlFor for Label element yet
      if (props.htmlFor) {
        _ref.current.htmlFor = props.htmlFor;
      } else if (reslovedProps !== null && reslovedProps !== void 0 && reslovedProps.nativeID) {
        _ref.current.htmlFor = reslovedProps.nativeID;
      }
    }
  }, [reslovedProps === null || reslovedProps === void 0 ? void 0 : reslovedProps.nativeID, props.htmlFor]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    flexDirection: "row",
    justifyContent: "flex-start",
    _web: {
      //@ts-ignore
      accessibilityRole: 'label'
    }
  }, reslovedProps, {
    nativeID: reslovedProps === null || reslovedProps === void 0 ? void 0 : reslovedProps.labelId,
    ref: mergedRef
  }), children, (reslovedProps === null || reslovedProps === void 0 ? void 0 : reslovedProps.isRequired) && requiredAsterisk());
};

export default /*#__PURE__*/memo( /*#__PURE__*/forwardRef(FormControlLabel));
//# sourceMappingURL=FormControlLabel.js.map
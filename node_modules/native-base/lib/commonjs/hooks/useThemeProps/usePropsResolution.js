"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePropsResolution = usePropsResolution;
exports.usePropsResolutionWithComponentTheme = void 0;

var _lodash = _interopRequireDefault(require("lodash.get"));

var _lodash2 = _interopRequireDefault(require("lodash.merge"));

var _reactNative = require("react-native");

var _useNativeBase = require("../useNativeBase");

var _colorMode = require("../../core/color-mode");

var _tools = require("../../theme/tools");

var _useContrastText = require("../useContrastText");

var _useBreakpointResolvedProps = require("../useBreakpointResolvedProps");

var _propsFlattener = require("./propsFlattener");

var _useResponsiveSSRProps = require("../useResponsiveSSRProps");

var _react = _interopRequireDefault(require("react"));

var _ResponsiveQueryProvider = require("../../utils/useResponsiveQuery/ResponsiveQueryProvider");

var _NativeBaseContext = require("../../core/NativeBaseContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SPREAD_PROP_SPECIFICITY_ORDER = ['p', 'padding', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'm', 'margin', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
const FINAL_SPREAD_PROPS = ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
const MARGIN_MAP = {
  mx: ['marginRight', 'marginLeft'],
  my: ['marginTop', 'marginBottom'],
  mt: ['marginTop'],
  mb: ['marginBottom'],
  mr: ['marginRight'],
  ml: ['marginLeft']
};
MARGIN_MAP.margin = [...MARGIN_MAP.mx, ...MARGIN_MAP.my];
MARGIN_MAP.m = MARGIN_MAP.margin;
MARGIN_MAP.marginTop = MARGIN_MAP.mt;
MARGIN_MAP.marginBottom = MARGIN_MAP.mb;
MARGIN_MAP.marginLeft = MARGIN_MAP.ml;
MARGIN_MAP.marginRight = MARGIN_MAP.mr;
const PADDING_MAP = {
  px: ['paddingRight', 'paddingLeft'],
  py: ['paddingTop', 'paddingBottom'],
  pt: ['paddingTop'],
  pb: ['paddingBottom'],
  pr: ['paddingRight'],
  pl: ['paddingLeft']
};
PADDING_MAP.padding = [...PADDING_MAP.px, ...PADDING_MAP.py];
PADDING_MAP.p = PADDING_MAP.padding;
PADDING_MAP.paddingTop = PADDING_MAP.pt;
PADDING_MAP.paddingBottom = PADDING_MAP.pb;
PADDING_MAP.paddingLeft = PADDING_MAP.pl;
PADDING_MAP.paddingRight = PADDING_MAP.pr;
const SPREAD_PROP_SPECIFICITY_MAP = { ...PADDING_MAP,
  ...MARGIN_MAP
};

function propsSpreader(incomingProps, incomingSpecifity) {
  const flattenedDefaultProps = { ...incomingProps
  };
  const specificity = {};
  SPREAD_PROP_SPECIFICITY_ORDER.forEach(prop => {
    if (prop in flattenedDefaultProps) {
      const val = incomingProps[prop] || flattenedDefaultProps[prop];

      if (!FINAL_SPREAD_PROPS.includes(prop)) {
        delete flattenedDefaultProps[prop];
        specificity[prop] = incomingSpecifity[prop];
      }

      SPREAD_PROP_SPECIFICITY_MAP[prop].forEach(newProp => {
        if ((0, _propsFlattener.compareSpecificity)(specificity[newProp], specificity[prop])) {
          specificity[newProp] = incomingSpecifity[prop];
          flattenedDefaultProps[newProp] = val;
        }
      });
    }
  });
  return (0, _lodash2.default)({}, flattenedDefaultProps);
}
/**
 * @summary Combines provided porps with component's theme props and resloves them.
 * @arg {string} component - Name of the component.
 * @arg {object} incomingProps - Props passed by the user.
 * @arg {object} state - dependent states.
 * @arg {object} config - configuration for resolution. Accepts key like ignoreProps, resolveResponsively.
 * @returns {object} Resolved and flattened props.
 */


function usePropsResolution(component, incomingProps, state, config) {
  var _config$componentThem;

  const {
    theme
  } = (0, _useNativeBase.useNativeBase)();
  const componentTheme = (_config$componentThem = config === null || config === void 0 ? void 0 : config.componentTheme) !== null && _config$componentThem !== void 0 ? _config$componentThem : (0, _lodash.default)(theme, "components.".concat(component), {});

  if (process.env.NODE_ENV === 'development' && incomingProps.debug) {
    /* eslint-disable-next-line */
    console.log("%c".concat(component), 'background: #d97706; color: #111; font-weight: 700; padding: 2px 8px;');
    /* eslint-disable-next-line */

    console.log("%cusePropsResolution", 'background: #4b5563; color: #d97706; font-weight: 700; padding: 2px 8px;');
    /* eslint-disable-next-line */

    console.log('%c incomingProps: ', 'color: #4ade80; font-weight: 700;', incomingProps);
    /* eslint-disable-next-line */

    console.log('%c state: ', 'color: #4ade80; font-weight: 700;', state);
    /* eslint-disable-next-line */

    console.log('%c componentTheme: ', 'color: #4ade80; font-weight: 700;', componentTheme);
  }

  const resolvedProps = usePropsResolutionWithComponentTheme(componentTheme, incomingProps, state, config);

  if (process.env.NODE_ENV === 'development' && incomingProps.debug) {
    /* eslint-disable-next-line */
    console.log('%c resolvedProps: ', 'color: #22d3ee; font-weight: 700;', resolvedProps);
  }

  return resolvedProps;
}

const usePropsResolutionWithComponentTheme = (componentTheme, incomingProps, state, config) => {
  var _flattenProps$bg, _flattenProps$backgro, _flattenProps$bgColor, _flattenProps$backgro2, _ref, _flattenProps$bg2, _flattenProps, _flattenProps$_text, _flattenProps2, _flattenProps2$_text;

  const modifiedPropsForSSR = (0, _useResponsiveSSRProps.useResponsiveSSRProps)(incomingProps);
  const [ignoredProps, cleanIncomingProps] = (0, _tools.extractInObject)(modifiedPropsForSSR, ['children', 'onPress', 'icon', 'onOpen', 'onClose'].concat((config === null || config === void 0 ? void 0 : config.ignoreProps) || []));

  const responsiveQueryContext = _react.default.useContext(_ResponsiveQueryProvider.ResponsiveQueryContext);

  const disableCSSMediaQueries = responsiveQueryContext.disableCSSMediaQueries;
  const resolveResponsively = ['colorScheme', 'size', 'variant', ...((config === null || config === void 0 ? void 0 : config.resolveResponsively) || [])];
  const {
    theme
  } = (0, _useNativeBase.useNativeBase)();
  const colorModeProps = (0, _colorMode.useColorMode)(); // STEP 1: combine default props and incoming props

  const incomingWithDefaultProps = (0, _lodash2.default)({}, componentTheme.defaultProps || {}, cleanIncomingProps); // STEP 2: flatten them

  if (process.env.NODE_ENV === 'development' && cleanIncomingProps.debug) {
    /* eslint-disable-next-line */
    console.log("%cFlattening incoming and Default", 'background: #4b5563; color: #FFF; font-weight: 700; padding: 2px 8px;');
  }

  let [flattenProps, specificityMap] = (0, _propsFlattener.propsFlattener)({
    props: incomingWithDefaultProps,
    platform: _reactNative.Platform.OS,
    colormode: colorModeProps.colorMode,
    state: state || {},
    previouslyFlattenProps: {},
    cascadePseudoProps: config === null || config === void 0 ? void 0 : config.cascadePseudoProps
  }, 2); // console.log(resolveResponsively);
  // Not work for SSR

  const responsiveProps = {};

  if (disableCSSMediaQueries) {
    // STEP 2.5: resolving responsive props
    resolveResponsively.map(propsName => {
      if (flattenProps[propsName]) {
        // @ts-ignore
        responsiveProps[propsName] = flattenProps[propsName];
      }
    });
  }

  if (resolveResponsively.includes('direction')) {
    const propName = 'direction';

    if (flattenProps[propName]) {
      // @ts-ignore
      responsiveProps[propName] = flattenProps[propName];
    }
  }

  const responsivelyResolvedProps = (0, _useBreakpointResolvedProps.useBreakpointResolvedProps)(responsiveProps);
  flattenProps = { ...flattenProps,
    ...responsivelyResolvedProps
  }; // STEP 3: Pass it to baseStyle, then variant and then size and resolve them.
  // NOTE: Resoloving baseStyle

  let componentBaseStyle = {},
      flattenBaseStyle,
      baseSpecificityMap;

  if (componentTheme.baseStyle) {
    componentBaseStyle = typeof componentTheme.baseStyle !== 'function' ? componentTheme.baseStyle : componentTheme.baseStyle({
      theme,
      ...flattenProps,
      ...colorModeProps
    });

    if (process.env.NODE_ENV === 'development' && cleanIncomingProps.debug) {
      /* eslint-disable-next-line */
      console.log("%cFlattening baseStyle", 'background: #4b5563; color: #eee; font-weight: 700; padding: 2px 8px;');
    }

    [flattenBaseStyle, baseSpecificityMap] = (0, _propsFlattener.propsFlattener)({
      props: process.env.NODE_ENV === 'development' && cleanIncomingProps.debug ? { ...componentBaseStyle,
        debug: true
      } : componentBaseStyle,
      platform: _reactNative.Platform.OS,
      colormode: colorModeProps.colorMode,
      state: state || {},
      currentSpecificityMap: specificityMap,
      previouslyFlattenProps: flattenProps,
      cascadePseudoProps: config === null || config === void 0 ? void 0 : config.cascadePseudoProps
    }, 1);
  } // NOTE: Resolving variants


  const variant = flattenProps.variant;
  let componentVariantProps = {},
      flattenVariantStyle,
      variantSpecificityMap; // Extracting props from variant

  if (variant && componentTheme.variants && componentTheme.variants[variant]) {
    componentVariantProps = typeof componentTheme.variants[variant] !== 'function' ? componentTheme.variants[variant] : //@ts-ignore
    componentTheme.variants[variant]({
      theme,
      ...flattenProps,
      ...colorModeProps
    });

    if (process.env.NODE_ENV === 'development' && cleanIncomingProps.debug) {
      /* eslint-disable-next-line */
      console.log("%cFlattening variantStyle", 'background: #4b5563; color: #FFF; font-weight: 700; padding: 2px 8px;');
    }

    [flattenVariantStyle, variantSpecificityMap] = (0, _propsFlattener.propsFlattener)({
      props: process.env.NODE_ENV === 'development' && cleanIncomingProps.debug ? { ...componentVariantProps,
        debug: true
      } : componentVariantProps,
      platform: _reactNative.Platform.OS,
      colormode: colorModeProps.colorMode,
      state: state || {},
      currentSpecificityMap: baseSpecificityMap || specificityMap,
      // NOTE: Ideally flattenBaseStyle and flattenProps should be deeply merged to create previouslyFlattenProps.
      previouslyFlattenProps: flattenProps,
      cascadePseudoProps: config === null || config === void 0 ? void 0 : config.cascadePseudoProps
    }, 1); // We remove variant from original props if we found it in the componentTheme
    //@ts-ignore

    flattenProps.variant = undefined;
  } // NOTE: Resolving size


  const size = flattenProps.size;
  let componentSizeProps = {},
      flattenSizeStyle,
      sizeSpecificityMap; // Extracting props from size

  if (size && componentTheme.sizes && componentTheme.sizes[size]) {
    // Type - sizes: {lg: 1}. Refer icon theme
    if (typeof componentTheme.sizes[size] === 'string' || typeof componentTheme.sizes[size] === 'number') {
      flattenProps.size = componentTheme.sizes[size]; //@ts-ignore
      // componentSizeProps.size = componentTheme.sizes[size];
    } // Type - sizes: (props) => ({lg: {px: 1}}). Refer heading theme
    else if (typeof componentTheme.sizes[size] === 'function') {
        flattenProps.size = undefined; //@ts-ignore

        componentSizeProps = componentTheme.sizes[size]({
          theme,
          ...flattenProps,
          ...colorModeProps
        });
      } // Type - sizes: {lg: {px: 1}}. Refer button theme
      else {
          flattenProps.size = undefined;
          componentSizeProps = componentTheme.sizes[size];
        }

    if (process.env.NODE_ENV === 'development' && cleanIncomingProps.debug) {
      /* eslint-disable-next-line */
      console.log("%cFlattening sizeStyle", 'background: #4b5563; color: #FFF; font-weight: 700; padding: 2px 8px;');
    }

    [flattenSizeStyle, sizeSpecificityMap] = (0, _propsFlattener.propsFlattener)({
      props: process.env.NODE_ENV === 'development' && cleanIncomingProps.debug ? { ...componentSizeProps,
        debug: true
      } : componentSizeProps,
      platform: _reactNative.Platform.OS,
      colormode: colorModeProps.colorMode,
      state: state || {},
      currentSpecificityMap: variantSpecificityMap || baseSpecificityMap || specificityMap,
      previouslyFlattenProps: flattenProps,
      cascadePseudoProps: config === null || config === void 0 ? void 0 : config.cascadePseudoProps
    }, 1);
  } // // STEP 4: merge


  const defaultStyles = (0, _lodash2.default)({}, flattenBaseStyle, flattenVariantStyle, flattenSizeStyle);

  for (const prop in defaultStyles) {
    delete flattenProps[prop];
  }

  const defaultSpecificity = (0, _lodash2.default)({}, specificityMap, baseSpecificityMap, variantSpecificityMap, sizeSpecificityMap);
  flattenProps = propsSpreader({ ...defaultStyles,
    ...flattenProps
  }, defaultSpecificity); // // STEP 5: linear Grad and contrastText

  let ignore = [];

  if ((_flattenProps$bg = flattenProps.bg) !== null && _flattenProps$bg !== void 0 && _flattenProps$bg.linearGradient || (_flattenProps$backgro = flattenProps.background) !== null && _flattenProps$backgro !== void 0 && _flattenProps$backgro.linearGradient || (_flattenProps$bgColor = flattenProps.bgColor) !== null && _flattenProps$bgColor !== void 0 && _flattenProps$bgColor.linearGradient || (_flattenProps$backgro2 = flattenProps.backgroundColor) !== null && _flattenProps$backgro2 !== void 0 && _flattenProps$backgro2.linearGradient) {
    var _flattenProps$backgro3, _flattenProps$bgColor2, _flattenProps$backgro4;

    let bgProp = 'bg';

    if ((_flattenProps$backgro3 = flattenProps.background) !== null && _flattenProps$backgro3 !== void 0 && _flattenProps$backgro3.linearGradient) {
      bgProp = 'background';
    } else if ((_flattenProps$bgColor2 = flattenProps.bgColor) !== null && _flattenProps$bgColor2 !== void 0 && _flattenProps$bgColor2.linearGradient) {
      bgProp = 'bgColor';
    } else if ((_flattenProps$backgro4 = flattenProps.backgroundColor) !== null && _flattenProps$backgro4 !== void 0 && _flattenProps$backgro4.linearGradient) {
      bgProp = 'backgroundColor';
    }

    flattenProps[bgProp].linearGradient.colors = flattenProps[bgProp].linearGradient.colors.map(color => {
      return (0, _lodash.default)(theme.colors, color, color);
    });
    ignore = ['bg', 'background', 'backgroundColor', 'bgColor'];
  } // // NOTE: seprating bg props when linearGardiant is available


  const [gradientProps] = (0, _tools.extractInObject)(flattenProps, ignore);
  const disableContrastText = (0, _NativeBaseContext.useNativeBaseConfig)('NativeBaseConfigProvider').disableContrastText;
  const bgColor = (_ref = (_flattenProps$bg2 = flattenProps.bg) !== null && _flattenProps$bg2 !== void 0 ? _flattenProps$bg2 : flattenProps.backgroundColor) !== null && _ref !== void 0 ? _ref : flattenProps.bgColor;
  const contrastTextColor = (0, _useContrastText.useContrastText)(bgColor, (_flattenProps = flattenProps) === null || _flattenProps === void 0 ? void 0 : (_flattenProps$_text = _flattenProps._text) === null || _flattenProps$_text === void 0 ? void 0 : _flattenProps$_text.color, disableCSSMediaQueries ? disableContrastText ? true : false : true);
  flattenProps._text = contrastTextColor && ((_flattenProps2 = flattenProps) === null || _flattenProps2 === void 0 ? void 0 : (_flattenProps2$_text = _flattenProps2._text) === null || _flattenProps2$_text === void 0 ? void 0 : _flattenProps2$_text.color) === undefined ? {
    color: contrastTextColor,
    ...flattenProps._text
  } : flattenProps._text;
  const resolvedProps = (0, _tools.omitUndefined)({ ...flattenProps,
    ...ignoredProps,
    ...gradientProps
  }); // STEP 6: Return
  // flattenProps = {};
  // propertyDepth = {};

  return resolvedProps;
};

exports.usePropsResolutionWithComponentTheme = usePropsResolutionWithComponentTheme;
//# sourceMappingURL=usePropsResolution.js.map
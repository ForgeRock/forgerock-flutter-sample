import type { Leaves } from '../../theme/base/types';
import type { ITheme } from '../../theme';
import type { ResponsiveValue } from './responsiveValue';
export declare type VariantType<Component extends keyof ITheme['components']> = 'variants' extends keyof ITheme['components'][Component] ? ResponsiveValue<keyof ITheme['components'][Component]['variants'] | (string & {})> : unknown;
export declare type SpaceType = ResponsiveValue<keyof ITheme['space'] | (string & {}) | number>;
export declare type SizeType = ResponsiveValue<keyof ITheme['sizes'] | (string & {}) | number>;
export declare type ColorType = ResponsiveValue<Leaves<ITheme['colors']> | (string & {})>;

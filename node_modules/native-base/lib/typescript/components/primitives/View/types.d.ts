import type { ViewProps } from 'react-native';
import type { SafeAreaProps } from '../../../components/types';
import type { StyledProps } from '../../../theme/types';
export declare type IViewProps = ViewProps & StyledProps & SafeAreaProps & {
    children?: any;
};

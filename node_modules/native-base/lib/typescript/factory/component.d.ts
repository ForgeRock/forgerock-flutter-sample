import React from 'react';
import type { ComponentTheme } from '../theme';
export default function Factory<P>(Component: React.ComponentType<P>, componentTheme?: ComponentTheme): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & import("../theme").StyledProps & import("../components/types").PlatformProps<import("../theme").StyledProps> & {
    children?: string | JSX.Element | JSX.Element[] | undefined;
}> & React.RefAttributes<unknown>>;

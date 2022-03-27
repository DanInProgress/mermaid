import { getThemeVariables as baseThemeVariables } from './theme-base';
import { getThemeVariables as darkThemeVariables } from './theme-dark';
import { getThemeVariables as defaultThemeVariables } from './theme-default';
import { getThemeVariables as forestThemeVariables } from './theme-forest';
import { getThemeVariables as neutralThemeVariables } from './theme-neutral';
import { getThemeVariables as cssColorVarsThemeVariables } from './theme-csscolorvars';

const themes = {
    base: {
        getThemeVariables: baseThemeVariables,
    },
    dark: {
        getThemeVariables: darkThemeVariables,
    },
    default: {
        getThemeVariables: defaultThemeVariables,
    },
    forest: {
        getThemeVariables: forestThemeVariables,
    },
    neutral: {
        getThemeVariables: neutralThemeVariables,
    },
    csscolors: {
        getThemeVariables: cssColorVarsThemeVariables,
    }
};

themes.registerTheme = (name, theme) => {
    themes[name] = theme
}


export default themes
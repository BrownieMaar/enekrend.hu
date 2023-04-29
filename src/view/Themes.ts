import {ThemeOptions} from '@mui/material/styles';
import {createTheme} from "@mui/material";


const lightThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#8e0000',
        },
        secondary: {
            main: '#ef6c00',
        },
        background: {
            default: '#f1f1f1',
            paper: '#ffffff',
        },
    },
};

const darkThemeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#c32f2f',
        },
        secondary: {
            main: '#ef6c00',
        },
        background: {
            default: '#000000',
            paper: '#201c1c',
        },
    },
};

export const enekrendThemeLight = createTheme(lightThemeOptions);
export const enekrendThemeDark = createTheme(darkThemeOptions);
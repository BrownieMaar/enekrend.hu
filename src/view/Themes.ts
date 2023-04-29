import { ThemeOptions } from '@mui/material/styles';
import {createTheme} from "@mui/material";

const themeOptions: ThemeOptions = {
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

export const enekrendTheme = createTheme(themeOptions);
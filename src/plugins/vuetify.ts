import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createVuetify, type ThemeDefinition } from 'vuetify';

const CustomTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#060933',
    'on-background': '#FFFFFF',
    'on-surface': '#FFFFFF',
    // primary: '#060933',
    // secondary: '#060933',
    surface: '#060933',
  },
  variables: {},
};
const theme = {
  defaultTheme: 'CustomTheme',
  themes: {
    CustomTheme,
  },
};
export default createVuetify({
  theme,
});

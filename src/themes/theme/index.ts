// PROJECT IMPORTS
import Theme4 from './theme4';

// TYPES
import { PaletteThemeProps } from 'types/theme';
import { ThemeMode, PresetColor } from 'types/config';

// ==============================|| PRESET THEME - THEME SELECTOR ||============================== //

const Theme = (presetColor: PresetColor, mode: ThemeMode): PaletteThemeProps => {
  return Theme4(mode);
};

export default Theme;

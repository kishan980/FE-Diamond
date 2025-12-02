'use client';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { ThemeDirection, ThemeMode } from 'types/config';

interface UIStyledGridProps {
  themeDirection: ThemeDirection;
}

export const UIStyledGrid = styled(Grid)<UIStyledGridProps>(({ theme, themeDirection }) => ({
  '& .rdw-editor-wrapper': {
    backgroundColor: theme.palette.background.default,
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: '4px',
    overflow: 'visible',
    '& .rdw-editor-main': {
      paddingInline: theme.spacing(2),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      border: 'none',
    },
    '& .rdw-editor-toolbar': {
      paddingTop: theme.spacing(1.25),
      border: 'none',
      borderBottom: '1px solid',
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.secondary.light,
      color: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary.lighter : theme.palette.text.primary,
      '& .rdw-option-wrapper': {
        backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary.light : theme.palette.secondary.lighter,
        borderColor: theme.palette.divider,
      },
      '& .rdw-dropdown-wrapper': {
        backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary.light : theme.palette.secondary.lighter,
        borderColor: theme.palette.divider,
        '& .rdw-dropdown-selectedtext': {
          color: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[100] : theme.palette.secondary.darker,
        },
        '& .rdw-dropdownoption-default': {
          color: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[100] : theme.palette.secondary.darker,
        },
        '& .rdw-dropdown-carettoopen': {
          position: themeDirection === ThemeDirection.RTL ? 'initial' : 'absolute',
        },
      },
      '& .rdw-emoji-modal': {
        left: { xs: -140, sm: -195, md: 5 },
      },
      '& .rdw-embedded-modal': {
        left: { xs: -100, sm: -165, md: 5 },
      },
      '& .rdw-link-modal': {
        left: { xs: 0, sm: -100, md: 5 },
      },
      '& .rdw-image-modal': {
        left: { xs: -190, sm: 30, md: 5 },
        top: '15px',
      },
      '& .rdw-colorpicker-modal': {
        left: { xs: -150, sm: 5 },
      },
    },
    ...(theme.direction === ThemeDirection.RTL && {
      '.rdw-dropdown-carettoopen': {
        position: 'absolute !important',
        right: '10%',
        left: 'inherit',
      },
      '.rdw-dropdown-carettoclose': {
        right: '10%',
        left: 'inherit',
      },
    }),
  },
}));

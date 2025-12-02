export default function LoadingButton() {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          '& svg': { width: 22, height: 22, color: '#3c64d0' },
          paddingLeft: 16,
          paddingRight: 16,
          '&.Mui-disabled': { backgroundColor: 'rgba(60, 100, 208, 0.3)' },
          '&.MuiLoadingButton-loading': {
            opacity: 0.6,
            textShadow: 'none',
            '& .MuiLoadingButton-loadingIndicatorStart': { left: 12 },
            '& .MuiLoadingButton-loadingIndicatorEnd': { right: 12 },
            '& .MuiCircularProgress-root': { width: '22px !important', height: '22px !important' },
          },
        },
      },
    },
  };
}

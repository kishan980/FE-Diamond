import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

export const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    border: '1px solid',
    borderColor: theme.palette.grey[300],
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  '& .MuiSvgIcon-root': {
    height: 20,
    width: 20,
    marginRight: theme.spacing(0.5),
  },
  '&& .MuiTouchRipple-rippleVisible': { animationDuration: '300ms' },
  '& .MuiMenuItem-root': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    ':hover': { backgroundColor: '#F3ECFC' },
    '& svg': { width: 20, height: 20 },
  },
  '& .MuiDivider-root': { margin: '0 !important' },
}));

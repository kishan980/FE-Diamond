'use client';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import TableCell from '@mui/material/TableCell';
import LoadingButton from '@mui/lab/LoadingButton';

export const UpsertTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: theme.spacing(1.5),
}));

export const UpsertTitleTypography = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
}));

export const StyledBackdrop = styled(Backdrop)(() => ({
  color: '#07bc0c',
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(5px)',
}));

export const StyledCountdownLoader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBlock: theme.spacing(2),
  width: '100%',
  minWidth: '160px',
}));

export const StyledCountdownWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'left',
}));

export const StyledEventDateTimeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  paddingInline: theme.spacing(2.5),
  borderRadius: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
  width: 'auto',
  maxWidth: '100%',
  textAlign: 'center',
}));

export const StyledCountdownContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  width: 'auto',
  maxWidth: '100%',
  height: 'auto',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: { gap: theme.spacing(1), padding: theme.spacing(1) },
}));

export const StyledDateColumn = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:last-child': { borderBottom: 'none' },
}));

export const StyledTotalValueWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'left',
}));

export const StyledTotalValueContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  width: 'auto',
  minWidth: 246,
  maxWidth: '100%',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(0.5), borderRadius: theme.spacing(1) },
}));

export const StyledEventClosedMessage = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': { borderBottom: 'none' },
}));

export const StyledTotalValueRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:last-child': { borderBottom: 'none' },
  '@media (max-width: 330px)': {
    flexDirection: 'column',
  },
}));

export const StyledCountdownTimeRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, auto)',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:last-child': { borderBottom: 'none' },
  [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.75) },
}));

export const StyledEventOnGoingTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
}));

export const StyledEventUpcomingMessage = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

export const StyledCountdownDigit = styled(Typography)(() => ({
  minWidth: 40,
  textAlign: 'center',
  fontWeight: 'bold',
}));

export const StyledCountdownLabel = styled(Typography)(() => ({
  minWidth: 40,
  textAlign: 'center',
  fontWeight: 'medium',
}));

export const StyledActionButtonGroup = styled(Stack)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  width: '100%',
}));

export const StyledRightAlignedIconGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'right',
  gap: theme.spacing(1),
}));

export const CardHeaderIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0),
    alignItems: 'end',
  },
}));

export const StyledIconButton = styled(IconButton)(() => ({
  padding: 0,
  '& svg': { height: 24, width: 24 },
}));

export const StyledLeftAlignedIconGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'left',
  gap: theme.spacing(0.5),
}));

export const StyledBidderFilterWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledFilterLabel = styled(Typography)(() => ({
  color: '#808080',
  fontWeight: 'bold',
}));

export const StyledSearchToggleWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const StyledSearchControlRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const SearchFilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(1),
}));

export const StyledStickySearchBarRow = styled(TableRow)(() => ({
  position: 'sticky',
  top: 0,
  zIndex: 2,
}));

export const StyledStickyTableHeaderRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isSearchOpen',
})<{ isSearchOpen: boolean }>(({ isSearchOpen }) => ({
  position: 'sticky',
  top: isSearchOpen ? 80.5 : 35.3,
  zIndex: 2,
}));

export const StickyHeaderRowTotalTitle = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isSearchOpen',
})<{ isSearchOpen: boolean }>(({ isSearchOpen }) => ({
  position: 'sticky',
  top: isSearchOpen ? 118 : 68,
  zIndex: 1,
}));

export const StyledEllipsisText = styled(Typography)(() => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const StyledSearchToggleLabel = styled(Typography)(() => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  cursor: 'pointer',
}));

export const UpcomingEventsButton = styled(IconButton)(({ theme }) => ({
  transition: '0.3s',
  padding: theme.spacing(1),
  '&:hover': { bgcolor: '#e3f2fd' },
  '& .MuiBadge-badge': { top: 4, right: 4 },
}));

export const StickyColCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'fixRight' && prop !== 'fixWidth',
})<{ fixRight: number; fixWidth: number }>(({ theme, fixRight, fixWidth }) => ({
  position: 'sticky',
  right: fixRight,
  zIndex: 1,
  minWidth: fixWidth,
  backgroundColor: 'white',
  borderBottom: '1px solid rgba(219, 224, 229, 0.65)',
  '.Mui-selected &': {
    backgroundColor: '#fff',
    // zIndex: 3,
  },
  '.hover-row:hover:not(.Mui-selected) &': {
    backgroundColor: '#f5f5f5',
  },
  [theme.breakpoints.down('md')]: { position: 'unset' },
}));

export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  whiteSpace: 'nowrap',
  height: 'fit-content',
  textTransform: 'none',
  fontSize: '0.80rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.875rem',
  },
}));

export const UserStatusIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.success.main : theme.palette.grey[400],
}));

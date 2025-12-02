import { styled } from '@mui/material/styles';
import SimpleBar from 'components/third-party/SimpleBar';

export const StyledAllBidderSimpleBar = styled(SimpleBar)(() => ({
  overflowX: 'hidden',
  height: 'calc(100vh - 318px)',
  minHeight: 180,
  '& .simplebar-content': {
    height: '100%',
  },
}));

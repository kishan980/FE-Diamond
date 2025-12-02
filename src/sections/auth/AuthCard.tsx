// MATERIAL - UI
import Box from '@mui/material/Box';

// PROJECT IMPORTS
import { MainCardStyle } from './AuthWrapper3.styled';
import { MainCardProps } from 'components/MainCard';

// ==============================|| AUTHENTICATION - CARD ||============================== //

const AuthCard = ({ children, ...other }: MainCardProps) => (
  <MainCardStyle content={false} {...other}>
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
  </MainCardStyle>
);

export default AuthCard;

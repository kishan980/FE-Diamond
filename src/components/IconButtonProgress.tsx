import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const IconButtonProgress = () => {
  return (
    <Box sx={{ position: 'absolute' }}>
      <CircularProgress
        size={24}
        sx={{
          color: 'primary',
          '& .MuiCircularProgress-svg': { transform: 'scale(0.6)', transformOrigin: 'center' },
        }}
      />
    </Box>
  );
};

export default IconButtonProgress;

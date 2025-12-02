import Box from '@mui/material/Box';

const PrintLogo = () => {
  return (
    <Box className="print-logo-wrapper">
      <Box component="img" src="/assets/logo/logo.png" alt="DivTech Logo" className="print-logo" sx={{ display: 'none' }} />
    </Box>
  );
};

export default PrintLogo;

import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { Add, Notification } from 'iconsax-react';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { ThemeMode } from 'types/config';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();
  const [read] = useState(2);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'secondary.200' : 'secondary.200';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'secondary.100';

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          color="secondary"
          variant="light"
          onClick={handleToggle}
          aria-label="settings toggler"
          size="large"
          sx={{ color: 'secondary.main', bgcolor: open ? iconBackColorOpen : iconBackColor, p: 1 }}
        >
          <Tooltip title="Announcement">
            <Badge badgeContent={read} color="success" sx={{ '& .MuiBadge-badge': { top: 2, right: 4 } }}>
              <Notification variant="Bold" />
            </Badge>
          </Tooltip>
        </IconButton>
      </Box>
      <Drawer sx={{ zIndex: 2001 }} anchor="right" onClose={handleToggle} open={open} PaperProps={{ sx: { width: { xs: 350, sm: 474 } } }}>
        {open && (
          <MainCard content={false} sx={{ border: 'none', borderRadius: 0, height: '100vh' }}>
            <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                  <Typography variant="h5">What’s new announcement?</Typography>
                  <IconButton color="secondary" sx={{ p: 0 }} onClick={handleToggle}>
                    <Add size={28} style={{ transform: 'rotate(45deg)' }} />
                  </IconButton>
                </Stack>
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
};

export default Customization;

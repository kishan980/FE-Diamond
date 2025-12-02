import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Key, Logout } from 'iconsax-react';
import Divider from '@mui/material/Divider';
import { toast } from 'react-toastify';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { FormikState } from 'formik';
import { StyledPaper } from './Profile.styled';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import IconButton from 'components/@extended/IconButton';
import useUser from 'hooks/useUser';
import { ThemeMode } from 'types/config';
import UpdatePasswordDialog from 'components/UIComponent/Dialogs/UpdatePasswordDialog/UpdatePasswordDialog';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { ChangePasswordParams } from 'services/bidder/my-profile/type';

const ProfilePage = () => {
  const theme = useTheme();
  const router = useRouter();
  const user = useUser();
  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { username, entityID, entityTypeID } = imageDetails?.currentUserDetails ?? {};

  const [UpdateModelOpen, setUpdateModelOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<any>(null);

  const handleToggleMenu = () => setMenuOpen((prevOpen) => !prevOpen);

  const handleUpdatePasswordModelClose = () => setUpdateModelOpen(false);
  const handleClickUpdatePassword = () => {
    setUpdateModelOpen(true);
    handleToggleMenu();
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error logging out:', err);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current?.contains(event.target)) return;
    setMenuOpen(false);
  };

  const handleUpdateModalCilck = async (
    password: string,
    newPassword: string,
    confirmPassword: string,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: (
      nextState?: Partial<
        FormikState<{
          password: string;
          newPassword: string;
          confirmPassword: string;
        }>
      >
    ) => void
  ) => {
    try {
      const params: ChangePasswordParams = {
        entityId: entityID,
        entityTypeId: entityTypeID,
        currentPassword: password,
        newPassword,
        confirmPassword,
      };
      const res = await MyProfileServices.changePassword(params);

      if (typeof res !== 'string' && res.success) {
        toast.success('Password updated successfully');
        setUpdateModelOpen(false);
        resetForm();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error logging in handleLoginModalCilck:', error);
      toast.error('An error occurred while logging in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          borderRadius: 1,
          '&:hover': { bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={isMenuOpen ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggleMenu}
      >
        <Avatar>{username.charAt(0).toUpperCase() || 'A'}</Avatar>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={isMenuOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={isMenuOpen} {...TransitionProps}>
            <StyledPaper
              sx={{
                boxShadow: theme.customShadows.z1,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} content={false}>
                  <CardContent sx={{ px: 2, py: '12px !important' }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar>{username.charAt(0).toUpperCase() || 'A'}</Avatar>
                          <Stack>
                            <Typography variant="subtitle1">{user ? user?.name : ''}</Typography>
                            <Typography variant="subtitle1" color="secondary">
                              {username}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton size="large" color="error" sx={{ p: 1 }} onClick={handleLogout}>
                            <Logout variant="Bulk" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider sx={{ mt: 1 }} />
                  <ListItemButton sx={{ m: 0 }} onClick={handleClickUpdatePassword}>
                    <ListItemIcon sx={{ ml: 1 }}>
                      <Key variant="Bulk" size={20} />
                    </ListItemIcon>
                    <ListItemText primary="Reset Password" />
                  </ListItemButton>
                  <ListItemButton sx={{ m: 0 }} onClick={handleLogout}>
                    <ListItemIcon sx={{ ml: 1 }}>
                      <Logout variant="Bulk" size={20} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </MainCard>
              </ClickAwayListener>
            </StyledPaper>
          </Transitions>
        )}
      </Popper>
      <UpdatePasswordDialog
        open={UpdateModelOpen}
        handleClose={handleUpdatePasswordModelClose}
        handleUpdateModalCilck={handleUpdateModalCilck}
      />
    </Box>
  );
};

export default ProfilePage;

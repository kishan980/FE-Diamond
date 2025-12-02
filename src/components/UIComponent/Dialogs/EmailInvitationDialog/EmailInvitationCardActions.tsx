import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { CloseCircle, DirectboxSend, Refresh } from 'iconsax-react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import AnimateButton from 'components/@extended/AnimateButton';
import { StyledActionButtonGroup } from 'views/common.styled';
import { EmailInvitationCardActionsProps } from 'types/events';

const EmailInvitationCardActions = ({ isSubmitting, handleReset, handleClose }: EmailInvitationCardActionsProps) => (
  <CardActions>
    <StyledActionButtonGroup sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
      <AnimateButton>
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          variant="contained"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          startIcon={<DirectboxSend color="#d9e3f0" />}
        >
          Send Email To Selected Bidders
        </LoadingButton>
      </AnimateButton>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <AnimateButton>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ width: '100%' }}
              onClick={handleReset}
              disabled={isSubmitting}
              startIcon={<Refresh />}
            >
              Reset
            </Button>
          </AnimateButton>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <AnimateButton>
            <Button
              color="error"
              variant="outlined"
              sx={{ width: '100%' }}
              onClick={handleClose}
              disabled={isSubmitting}
              startIcon={<CloseCircle />}
            >
              Cancel
            </Button>
          </AnimateButton>
        </Box>
      </Box>
    </StyledActionButtonGroup>
  </CardActions>
);

export default EmailInvitationCardActions;

import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { CloseCircle, TickCircle } from 'iconsax-react';
import LoadingButton from '@mui/lab/LoadingButton';
import { ViewTermsAndConditionContainer, ViewTermsAndConditionMainContainer } from './ViewTermsAndConditionsModal.styled';
import { StyledRightAlignedIconGroup } from 'views/common.styled';
import { ViewTermsAndConditionDialogProps } from 'types/dialog';
import { TermConditionItem } from 'services/parameter/termsAndCondition/type';

const ViewTermsAndConditionsModal = ({
  open,
  handleClose,
  loading,
  handleAcceptClick,
  handleDeclineClick,
  termAndConditionItem,
}: ViewTermsAndConditionDialogProps<TermConditionItem>) => {
  const isURL = (text: string): boolean => {
    try {
      new URL(text);
      return Boolean(new URL(text));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in viewTermsAndCondition', e);
      return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') handleClose();
      }}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Please view the terms and conditions:
        </Typography>
      </DialogTitle>
      <DialogContent>
        <ViewTermsAndConditionMainContainer>
          {termAndConditionItem && termAndConditionItem.length > 0 && (
            <ViewTermsAndConditionContainer>
              <Typography variant="h6" textAlign="center">
                {termAndConditionItem[0]?.InsUserID}
              </Typography>
              <Typography variant="body1">
                {isURL(termAndConditionItem[0]?.TermsCondition) ? (
                  <iframe
                    src={termAndConditionItem[0]?.TermsCondition}
                    style={{ width: '100%', height: '500px', border: 'none' }}
                    title="Terms and Conditions"
                  ></iframe>
                ) : (
                  <Typography variant="body1">{termAndConditionItem[0]?.TermsCondition}</Typography>
                )}
              </Typography>
              <StyledRightAlignedIconGroup sx={{ justifyContent: { xs: 'center', sm: 'right' } }}>
                <LoadingButton
                  variant="contained"
                  onClick={handleAcceptClick}
                  startIcon={<TickCircle style={{ color: 'white' }} />}
                  loading={loading?.isConfirmLoading}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  I accept
                </LoadingButton>
                <LoadingButton
                  variant="outlined"
                  color="error"
                  onClick={handleDeclineClick}
                  startIcon={<CloseCircle color="red" />}
                  loading={loading?.isConfirmLoading}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  I decline
                </LoadingButton>
              </StyledRightAlignedIconGroup>
            </ViewTermsAndConditionContainer>
          )}
        </ViewTermsAndConditionMainContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTermsAndConditionsModal;

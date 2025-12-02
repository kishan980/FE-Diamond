'use client';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { Add, ArrangeHorizontal } from 'iconsax-react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { UploadLotsStackButton } from '../UploadLots.styled';
import AnimateButton from 'components/@extended/AnimateButton';
import { UploadLotsActionsProps } from 'types/events';

const UploadAdditionalActions = ({ loading, isSubmitting, handleAddRow, handleClickTransferButton }: UploadLotsActionsProps) => (
  <CardActions>
    <UploadLotsStackButton direction="row">
      <AnimateButton>
        <Button variant="dashed" sx={{ bgcolor: 'transparent !important', width: '100%' }} startIcon={<Add />} onClick={handleAddRow}>
          Add New
        </Button>
      </AnimateButton>
      <LoadingButton
        variant="contained"
        type="submit"
        startIcon={
          <Box component="img" src="/assets/icons/save.png" width={18} height={18} sx={{ mr: 1, filter: 'invert(1) brightness(2)' }} />
        }
        loading={isSubmitting || loading?.isConfirmLoading}
        sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
      >
        Save Lots
      </LoadingButton>

      <Button
        variant="contained"
        disabled={isSubmitting || loading?.isConfirmLoading}
        onClick={handleClickTransferButton}
        startIcon={<ArrangeHorizontal />}
      >
        Transfer To Ongoing Event
      </Button>
    </UploadLotsStackButton>
  </CardActions>
);

export default UploadAdditionalActions;

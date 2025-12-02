'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { LoadingButton } from '@mui/lab';
import { Add } from 'iconsax-react';
import { UploadLotsStackButton } from './UploadLots.styled';
import AnimateButton from 'components/@extended/AnimateButton';
import { UploadLotsActionsProps } from 'types/events';

const UploadLotsActions = ({ isSubmitting, handleAddRow, eventId, remainingTime }: UploadLotsActionsProps) => (
  <CardActions>
    <UploadLotsStackButton direction="row" sx={{ padding: { xs: 0 } }}>
      {remainingTime === 'Not Open Yet' && eventId && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <AnimateButton>
            <Button
              variant="dashed"
              sx={{ bgcolor: 'transparent !important', whiteSpace: 'nowrap' }}
              startIcon={<Add />}
              onClick={handleAddRow}
            >
              Add New
            </Button>
          </AnimateButton>
          <AnimateButton>
            <LoadingButton loading={isSubmitting} type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>
              <Box component="img" src="/assets/icons/save.png" width={18} height={18} sx={{ mr: 1, filter: 'invert(1) brightness(2)' }} />
              Save All Lots
            </LoadingButton>
          </AnimateButton>
        </Box>
      )}
    </UploadLotsStackButton>
  </CardActions>
);

export default UploadLotsActions;

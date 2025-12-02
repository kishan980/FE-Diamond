'use client';
import { usePathname, useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { LoadingButton } from '@mui/lab';
import { CloseCircle, MoneyChange, Refresh, Trash } from 'iconsax-react';
import Box from '@mui/material/Box';
import AnimateButton from 'components/@extended/AnimateButton';
import { StyledActionButtonGroup } from 'views/common.styled';
import { CardActionButtonsProps } from 'types/events';

const EventActionButton = ({
  isSubmitting,
  id,
  handleReset,
  remainingTime,
  isEnabled = false,
  handleDeleteClick,
}: CardActionButtonsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isUpsertEventForm = pathname.startsWith('/events/upsert-event');

  return (
    <CardActions>
      <StyledActionButtonGroup direction="row">
        <>
          {!remainingTime && id ? (
            <Button color="error" variant="outlined" onClick={() => router.back()} startIcon={<CloseCircle />} disabled={isSubmitting}>
              Cancel
            </Button>
          ) : (
            <>
              <AnimateButton>
                <LoadingButton
                  loading={isSubmitting || isEnabled}
                  type="submit"
                  variant="contained"
                  startIcon={
                    id ? (
                      <MoneyChange color="#d9e3f0" />
                    ) : (
                      <Box component="img" src="/assets/icons/save.png" width={18} height={18} sx={{ filter: 'invert(1) brightness(2)' }} />
                    )
                  }
                >
                  {id ? 'Update' : 'Save'}
                </LoadingButton>
              </AnimateButton>
              {!id && (
                <AnimateButton>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                    disabled={isEnabled || isSubmitting}
                    startIcon={<Refresh />}
                  >
                    Reset
                  </Button>
                </AnimateButton>
              )}
              <AnimateButton>
                <Button color="error" variant="outlined" onClick={() => router.back()} startIcon={<CloseCircle />} disabled={isSubmitting}>
                  Cancel
                </Button>
              </AnimateButton>
              {remainingTime === 'Not Open Yet' && isUpsertEventForm && (
                <AnimateButton>
                  <Button color="error" variant="contained" onClick={handleDeleteClick} startIcon={<Trash />}>
                    Delete
                  </Button>
                </AnimateButton>
              )}
            </>
          )}
        </>
      </StyledActionButtonGroup>
    </CardActions>
  );
};

export default EventActionButton;

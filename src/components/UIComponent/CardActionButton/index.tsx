'use client';
import { useRouter } from 'next/navigation';
import CardActions from '@mui/material/CardActions';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import { Refresh, CloseCircle, MoneyChange } from 'iconsax-react';
import Box from '@mui/material/Box';
import AnimateButton from 'components/@extended/AnimateButton';
import { StyledActionButtonGroup } from 'views/common.styled';
import { CardActionButtonsProps } from 'types/events';

const CardActionButtons = ({ isSubmitting, id, handleReset, isEnabled = false }: CardActionButtonsProps) => {
  const { back } = useRouter();

  return (
    <CardActions>
      <StyledActionButtonGroup direction="row">
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
            <Button variant="outlined" onClick={handleReset} disabled={isSubmitting || isEnabled} startIcon={<Refresh />}>
              Reset
            </Button>
          </AnimateButton>
        )}
        <AnimateButton>
          <Button color="error" variant="outlined" onClick={() => back()} disabled={isSubmitting} startIcon={<CloseCircle />}>
            Cancel
          </Button>
        </AnimateButton>
      </StyledActionButtonGroup>
    </CardActions>
  );
};

export default CardActionButtons;

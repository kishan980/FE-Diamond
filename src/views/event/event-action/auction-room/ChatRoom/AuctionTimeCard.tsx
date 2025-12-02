'use client';
import { Timer1 } from 'iconsax-react';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import TimeLeftDisplay from './TimeLeftDisplay';
import { StyledTimeCard, StyledTimeInputBox, StyledSubmitButton } from './AllLots/ChatAllLots.styled';
import AnimateButton from 'components/@extended/AnimateButton';
import { AuctionTimeCardProps } from 'types/chat';

const AuctionTimeCard = ({
  timeLeft,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleAddExtraTimeClick,
  isSubmitting,
  buttonLabel = 'Add Extra Time',
}: AuctionTimeCardProps) => {
  const isClosed = timeLeft === 'Closed';

  return (
    <StyledTimeCard variant="outlined">
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <TimeLeftDisplay status={isClosed ? 'Closed' : 'countdown'} endTime={timeLeft} />
          </Stack>

          <StyledTimeInputBox direction="row" spacing={2} alignItems="center">
            <TextField
              type="number"
              size="small"
              placeholder="Enter time (min)"
              fullWidth
              name="extraTime"
              value={values.extraTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.extraTime && Boolean(errors.extraTime)}
              helperText={touched.extraTime && errors.extraTime}
              disabled={isClosed}
              InputProps={{
                inputProps: { min: 1 },
              }}
            />

            <Box sx={{ marginLeft: '0px!important' }}>
              <AnimateButton>
                <StyledSubmitButton
                  loading={isSubmitting}
                  type="button"
                  variant="contained"
                  size="small"
                  disabled={isClosed}
                  startIcon={<Timer1 size={18} color="#d9e3f0" />}
                  onClick={handleAddExtraTimeClick}
                >
                  {buttonLabel}
                </StyledSubmitButton>
              </AnimateButton>
            </Box>
          </StyledTimeInputBox>
        </Stack>
      </CardContent>
    </StyledTimeCard>
  );
};

export default AuctionTimeCard;

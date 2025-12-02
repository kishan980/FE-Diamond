'use client';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SmsTracking } from 'iconsax-react';
import { SelectParticipantsSelectMainContainer, SelectParticipantsSelectSubContainer } from './SelectParticipants.styled';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { PARTICIPATION_CONFIRMATION_OPTIONS } from 'constants/event.constants';
import { SelectParticipantsData } from 'services/event/event-action/select-participants/type';
import { SelectParticipantsFiltersProps } from 'types/selectDropDown';

const SelectParticipantsFilters = ({
  data,
  loading,
  selected,
  participants,
  handleContactParticipants,
  handleParticipantStatusChange,
}: SelectParticipantsFiltersProps<SelectParticipantsData>) => {
  const isDropdownEnabled = data.length > 0 && selected.length > 0;
  const totalRecords = data.filter((item) => item.st === 1).length;
  const totalAttendance = data.filter((item) => item.IsAttended === true).length;
  const totalBidCount = data.filter((item) => item.bidcount === 1).length;

  return (
    <SelectParticipantsSelectMainContainer>
      <SelectParticipantsSelectSubContainer>
        <Typography fontWeight={600}>
          Total Participating Records:{' '}
          <Typography fontWeight={600} component="span" color="primary.main">
            {totalRecords}/{data.length}
          </Typography>
        </Typography>
        <Typography fontWeight={600}>
          Bids Placed/Attendance:{' '}
          <Typography fontWeight={600} component="span" color="primary.main">
            {totalBidCount}/{totalAttendance}
          </Typography>
        </Typography>
      </SelectParticipantsSelectSubContainer>
      <SelectParticipantsSelectSubContainer>
        <Button variant="contained" onClick={handleContactParticipants} startIcon={<SmsTracking />} disabled={loading.isProgress}>
          Contact Selected Participants
        </Button>
        <SelectFormControl
          label="Participation Confirmed?"
          id="participants"
          value={participants}
          onChange={handleParticipantStatusChange}
          options={PARTICIPATION_CONFIRMATION_OPTIONS?.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          disabled={!isDropdownEnabled}
        />
      </SelectParticipantsSelectSubContainer>
    </SelectParticipantsSelectMainContainer>
  );
};

export default SelectParticipantsFilters;

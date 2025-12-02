'use client';
import Typography from '@mui/material/Typography';
import { ManageAttendSelectMainContainer, ManageAttendSelectSubContainer } from './ManageAttendees.styled';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { ATTENDANCE_STATUS_OPTIONS, LOGIN_ENABLE_DISABLE_OPTIONS } from 'constants/event.constants';
import { ManageAttendData } from 'services/event/event-action/manage-attendees/type';
import { ManageAttendFiltersProps } from 'types/selectDropDown';

const ManageAttendFilters = ({
  data,
  attended,
  selected,
  loginEnabled,
  remainingTime,
  handleChangeAttended,
  handleChangeLoginEnabled,
}: ManageAttendFiltersProps<ManageAttendData>) => {
  const isDropdownEnabled = data.length > 0 && selected.length > 0;
  const isAttendedEnabled = isDropdownEnabled && remainingTime !== 'Not Open Yet';
  const totalRecords = data.filter((item) => item.IsAttended === true).length;
  const totalAttendance = data.filter((item) => item.IsAttended === true).length;
  const totalBidCount = data.filter((item) => item.bidcount === 1).length;

  return (
    <ManageAttendSelectMainContainer className="print-filter-hidden-container">
      <ManageAttendSelectSubContainer>
        <Typography fontWeight={600}>
          Total Attendees/Participants:{' '}
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
      </ManageAttendSelectSubContainer>
      <ManageAttendSelectSubContainer>
        <SelectFormControl
          label="Login Enabled?"
          id="loginEnabled"
          value={loginEnabled}
          onChange={handleChangeLoginEnabled}
          options={LOGIN_ENABLE_DISABLE_OPTIONS.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          disabled={!isDropdownEnabled}
        />
        <SelectFormControl
          label="Attended?"
          id="attended"
          value={attended}
          onChange={handleChangeAttended}
          options={ATTENDANCE_STATUS_OPTIONS.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          disabled={!isAttendedEnabled}
        />
      </ManageAttendSelectSubContainer>
    </ManageAttendSelectMainContainer>
  );
};

export default ManageAttendFilters;

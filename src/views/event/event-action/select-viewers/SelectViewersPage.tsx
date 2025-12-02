'use client';
import { useState, ChangeEvent, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import SelectViewersFilters from './SelectViewersFilters';
import SelectViewersTableBody from './SelectViewersTableBody';
import SelectViewersTableHeader from './SelectViewersTableHeader';
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { formatDateAndTime } from 'utils/format-date';
import { SelectViewersServices } from 'services/event/event-action/select-viewers/selectViewers.services';
import { ManageAttendeesServices } from 'services/event/event-action/manage-attendees/manageAttendees.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState, SearchFilters } from 'types/table';
import { SelectViewerData, UpdateViewerParams } from 'services/event/event-action/select-viewers/type';

const SelectViewersPage = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const searchParams = useSearchParams();

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('EntityID');

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [data, setData] = useState<SelectViewerData[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [sortBy, setSortBy] = useState<string>('');
  const [invited, setInvited] = useState<string>('');
  const [selected, setSelected] = useState<number[]>([]);
  const [loginEnabled, setLoginEnabled] = useState<string>('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const fetchSelectViewerData = async (filters: SearchFilters = searchFilters) => {
    const searchQuery = new URLSearchParams({
      ...(filters.companyName && { companyName: filters.companyName }),
      ...(filters.contactPerson && { contactPerson: filters.contactPerson }),
    }).toString();
    const sortByParams = `sortBy=${sortBy}`;
    await handleFetchData<SelectViewerData[]>(
      () => SelectViewersServices.selectViewersListData(eventId, sortByParams, searchQuery),
      setData,
      setLoading
    );
  };

  const handleClickSearch = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    await fetchSelectViewerData();
    setPage(0);
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.checked ? data.map((n) => n.EntityID) : []);

  const handleClick = (id: number, EmailID: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];
    let newSelectedEmails: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newSelectedEmails = newSelectedEmails.concat(selectedEmails, EmailID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedEmails = newSelectedEmails.concat(selectedEmails.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedEmails = newSelectedEmails.concat(selectedEmails.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      newSelectedEmails = newSelectedEmails.concat(selectedEmails.slice(0, selectedIndex), selectedEmails.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
    setSelectedEmails(newSelectedEmails);
  };

  let endformatDate = '';
  const endDate = searchParams.get('endDate');
  if (endDate) {
    endformatDate = formatDateAndTime(endDate);
  } else {
    endformatDate = 'Invalid or missing end date';
  }

  const isButtonDisabled = endformatDate ? new Date(endformatDate) < new Date() : false;
  const isDropdownEnabled = (data.length > 0 && selected.length > 0) || isButtonDisabled;

  const handleInvitedClick = (property: string) => setSortBy(property);

  const handleLoginClick = (property: string) => setSortBy(property);

  const handleResetFilters = async () => {
    setSearchFilters({});
    await fetchSelectViewerData({});
  };

  const handleStatusChange = async (
    event: SelectChangeEvent<number | string | boolean>,
    setState: Dispatch<SetStateAction<string>>,
    serviceFunction: (params: { id: number; seqNOList: string; act: number }) => Promise<any>
  ) => {
    const newValue = event.target.value as string;
    setState(newValue);

    if (selected.length > 0) {
      setLoading((prev) => ({ ...prev, isProgress: true }));

      const seqNOListArray = selected.map((id, index) => ({
        entityId: id,
        email: selectedEmails[index],
      }));

      const params: UpdateViewerParams = {
        id: eventId,
        seqNOList: JSON.stringify(seqNOListArray),
        act: Number(newValue),
      };
      const res = await serviceFunction(params);

      if (typeof res !== 'string' && res.success) {
        setSelected([]);
        await fetchSelectViewerData();
        setState('');
      }
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const handleChangeInvited = (event: SelectChangeEvent<number | string | boolean>) =>
    handleStatusChange(event, setInvited, SelectViewersServices.invitedViewer);

  const handleChangeLoginEnabled = (event: SelectChangeEvent<number | string | boolean>) =>
    handleStatusChange(event, setLoginEnabled, ManageAttendeesServices.loginEnabledViewer);

  useEffect(() => {
    fetchSelectViewerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <MainCard
      content={false}
      sx={{ '& .MuiCardHeader-root': { alignItems: { xs: 'flex-start', sm: 'center' }, marginTop: { xs: 1, sm: 0 } }, gap: 1 }}
      title="Select Viewers"
      secondary={
        <SelectViewersFilters
          invited={invited}
          loginEnabled={loginEnabled}
          handleChangeInvited={handleChangeInvited}
          handleChangeLoginEnabled={handleChangeLoginEnabled}
          isDropdownEnabled={isDropdownEnabled}
        />
      }
    >
      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflow: 'auto', maxHeight: 430 }}>
        <Table aria-label="sticky table" size="small" stickyHeader>
          <SelectViewersTableHeader
            data={data}
            order={order}
            orderBy={orderBy}
            rowCount={data.length}
            numSelected={selected.length}
            onRequestSort={handleRequestSort}
            handleLoginClick={handleLoginClick}
            onSelectAllClick={handleSelectAllClick}
            handleClickSearch={handleClickSearch}
            handleInvitedClick={handleInvitedClick}
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            handleResetFilters={handleResetFilters}
          />
          <SelectViewersTableBody
            data={data}
            page={page}
            order={order}
            orderBy={orderBy}
            loading={loading}
            rowsPerPage={rowsPerPage}
            handleClick={handleClick}
            isSelected={isSelected}
          />
        </Table>
      </TableContainer>
      <Divider />
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ '& p': { m: 0 } }}
      />
    </MainCard>
  );
};

export default SelectViewersPage;

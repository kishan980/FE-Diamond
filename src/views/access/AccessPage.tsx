'use client';
import { useState, ChangeEvent, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { LockSlash, Unlock } from 'iconsax-react';
import AccessTableBody from './AccessTableBody';
import { StyledMainCard } from './AccessPage.styled';
import Loader from 'components/Loader';
import { CardHeaderIconContainer } from 'views/common.styled';
import { AccessServices } from 'services/access/access.services';
import { useTableControls } from 'utils/useTableControls';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState, SearchFilters } from 'types/table';
import { AccessData, UpdateAccessParams } from 'services/access/types';
import { ACCESS_HEAD_CELLS } from 'constants/tableHeadCells';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';

const AccessPage = () => {
  const [data, setData] = useState<AccessData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [buttonDisable, setButtonDisable] = useState(true);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('EntityID');

  const isSelected = useCallback((id: number) => selectedIds.indexOf(id) !== -1, [selectedIds]);

  const totalRecords = useMemo(() => data.filter((item) => item.IsActive === false).length, [data]);

  const handleSelectAllClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedIds(event.target.checked ? data.map((d) => d.EntityID) : []);
    },
    [data]
  );

  const handleClick = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) return [...prev, id];
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  }, []);

  const fetchAccessData = async (filters: SearchFilters = searchFilters) => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const searchQuery = new URLSearchParams({
        ...(filters.companyName && { co_name: filters.companyName }),
        ...(filters.contactPerson && { contactPerson: filters.contactPerson }),
        ...(filters.accountType !== undefined && { accountType: filters.accountType.toString() }),
      }).toString();
      const accessData = await AccessServices.getAccessById(searchQuery);
      if (typeof accessData !== 'string' && accessData.success) {
        setData(accessData.data);
        const accessCurrentEvent = await AccessServices.accessListData();
        if (typeof accessCurrentEvent !== 'string' && accessCurrentEvent.success) {
          const accessCurrentEventData = accessCurrentEvent.data.length > 0;
          accessCurrentEventData ? setButtonDisable(true) : setButtonDisable(false);
        }
      } else {
        toast.error('Failed to load access data.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching access data:', error);
      toast.error('Error fetching access data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const handleClickSearch = async () => {
    await fetchAccessData();
    setPage(0);
  };

  const handleResetFilters = async () => {
    setSearchFilters({});
    await fetchAccessData({});
  };

  const handleAccessAction = async (actionType: number) => {
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one item to proceed.');
      return;
    }

    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const params: UpdateAccessParams = {
        seqNOList: selectedIds.join(','),
        act: actionType,
      };

      const res = await AccessServices.grantAccess(params);
      if (typeof res !== 'string' && res.success) {
        setSelectedIds([]);
        await fetchAccessData();
        toast.success(`Access ${actionType === 0 ? 'granted' : 'denied'} successfully`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleAccessAction:', error);
      toast.error(`An error occurred while ${actionType === 0 ? 'granting' : 'denying'} access`);
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  useEffect(() => {
    fetchAccessData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <StyledMainCard
      content={false}
      title="Access"
      secondary={
        <CardHeaderIconContainer gap="8px !important" justifyContent="end">
          <Button
            onClick={() => handleAccessAction(0)}
            variant="contained"
            size="small"
            startIcon={<Unlock />}
            disabled={loading?.isProgress}
          >
            Grant Access
          </Button>
          <Button
            onClick={() => handleAccessAction(1)}
            variant="contained"
            size="small"
            disabled={buttonDisable || loading?.isProgress}
            startIcon={<LockSlash />}
          >
            Deny Access
          </Button>
        </CardHeaderIconContainer>
      }
    >
      <Box sx={{ px: 3, py: 1 }}>
        <Typography>
          Total active records: {totalRecords}/{data.length}
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
        <Table aria-label="sticky table" size="small" stickyHeader>
          <CommonTableHeader
            title="Bidders"
            headCells={ACCESS_HEAD_CELLS}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            numSelected={selectedIds.length}
            onSelectAllClick={handleSelectAllClick}
            searchFields={['companyName', 'contactPerson']}
            searchDropDown={['accountType']}
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            handleClickSearch={handleClickSearch}
            handleResetFilters={handleResetFilters}
            showCheckbox
          />
          <AccessTableBody {...{ data, page, order, orderBy, loading, rowsPerPage, isSelected, handleClick }} />
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
    </StyledMainCard>
  );
};
export default AccessPage;

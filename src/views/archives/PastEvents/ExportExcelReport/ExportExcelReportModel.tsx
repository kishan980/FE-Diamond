'use client';
import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { CloseCircle } from 'iconsax-react';
import ExportExcelReportTableBody from './ExportExcelReportTableBody';
import ExportExcelReportTableHeader from './ExportExcelReportTableHeader';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { StyledFilterLabel, CardHeaderIconContainer } from 'views/common.styled';
import { useTableControls } from 'utils/useTableControls';
import { PastEventsServices } from 'services/archives/pastEvents/pastEvents.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { ExportExcelReportDialogProps } from 'types/dialog';
import { PastEventsData, UpdatePastEventsExcelForTenderBidHistoryParams } from 'services/archives/pastEvents/types';
import { handleExcelExport } from 'utils/exportUtils';

const ExportExcelReportModel = ({ open, handleClose, isDownloadAccess, startDate, endDate }: ExportExcelReportDialogProps) => {
  const [data, setData] = useState<PastEventsData[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isExcelButtonLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } =
    useTableControls('auTen_EvtId');

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.checked ? data.map((item) => item.auTen_EvtId) : []);

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const fetchData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const response = await PastEventsServices.pastEventsListData();
      if (typeof response !== 'string' && response.success) setData(response.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching past event data:', error);
      toast.error('Error fetching past event data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, []);

  const handleExportExcelClick = async () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      return;
    }

    const params: UpdatePastEventsExcelForTenderBidHistoryParams = {
      eventId: selected.toString(),
      entityId: 0,
      startDate,
      endDate,
    };
    handleExcelExport(() => PastEventsServices.pastEventsExcelForTenderBidHistory(params), setLoading, 'isExcelButtonLoading');
    setSelected([]);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!open) setSelected([]);
  }, [open]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') handleClose();
      }}
      maxWidth="sm"
    >
      <DialogTitle>
        <IconButton onClick={handleClose} style={{ position: 'absolute', right: 8, top: 3 }}>
          <CloseCircle />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 0, sm: 2.5 }, mt: 1 }}>
        <MainCard
          title=" "
          content={false}
          secondary={
            isDownloadAccess &&
            data.length > 0 && (
              <CardHeaderIconContainer>
                <StyledFilterLabel>Click to export data</StyledFilterLabel>
                <DownloadCSVButton title="Export Excel" onClick={handleExportExcelClick} isLoading={loading.isExcelButtonLoading} />
              </CardHeaderIconContainer>
            )
          }
        >
          <TableContainer sx={{ maxHeight: 430 }}>
            <Table aria-label="sticky table" size="small" stickyHeader>
              <ExportExcelReportTableHeader
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />

              <ExportExcelReportTableBody
                data={data}
                page={page}
                order={order}
                orderBy={orderBy}
                loading={loading}
                rowsPerPage={rowsPerPage}
                isSelected={isSelected}
                handleClick={handleClick}
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
      </DialogContent>
    </Dialog>
  );
};

export default ExportExcelReportModel;

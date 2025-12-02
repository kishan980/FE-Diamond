'use client';
import { useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CommonBiddersTableBody from '../CommonBiddersTableBody';
import { BidderBasicDetailsStackSelectContainer, BidderStackSelectMainContainer } from '../CommonBidder.styled';
import CommonBidderActionButton from '../CommonBidderActionButton';
import AllLotsTableHeader from './AllLotsTableHeader';
import { GetAllLotsData } from 'services/bidder/all-lots/type';
import { useTableControls } from 'utils/useTableControls';
import { AllLotsTableProps } from 'types/table';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { useBidInputLogic } from 'hooks/useBidInputLogic';

const AllLotsTable = ({
  isMineLoading,
  eventTenderData,
  data,
  values,
  loading,
  selected,
  mineData,
  pageSize,
  selectedMineID,
  isSubmitting,
  setValues,
  handleBlur,
  editedRows,
  isSelected,
  remainingTime,
  submittedRows,
  setEditedRows,
  eventCategory,
  handleClick,
  handleSelect,
  handleWithdraw,
  handleSubmitForm,
  handleSelectAllClick,
  handleMediaMenuClick,
  withdrawBidLoading,
}: AllLotsTableProps<GetAllLotsData>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const prevPageRef = useRef<number>(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const isClosed = !loading?.isTimerLoading && !remainingTime;

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { order, orderBy, handleRequestSort } = useTableControls('SeqNo');

  const { handleInputChange, handleManualPriceChange } = useBidInputLogic({
    data,
    values,
    setValues,
    editedRows,
    setEditedRows,
    isClosed,
  });

  const handlePageChange = (page: number) => {
    const prevPage = prevPageRef.current;
    const prevPageStart = (prevPage - 1) * pageSize;
    const prevPageEnd = prevPage * pageSize;

    const prevPageSeqNos = data.slice(prevPageStart, prevPageEnd).map((lot) => lot.SeqNo);

    const updatedValues = { ...values };
    const updatedEditedRows = new Set(editedRows);

    prevPageSeqNos.forEach((seqNo) => {
      if (editedRows.has(seqNo) && !submittedRows.has(seqNo)) {
        delete updatedValues[seqNo];
        updatedEditedRows.delete(seqNo);
      }
    });

    setValues(updatedValues);
    setEditedRows(updatedEditedRows);
    setCurrentPage(page);
    prevPageRef.current = page;
  };

  return (
    <>
      <BidderStackSelectMainContainer className="print-filter-hidden-container">
        <BidderBasicDetailsStackSelectContainer>
          <SelectFormControl
            label="Select Mine"
            id="mine-select"
            value={selectedMineID}
            options={[{ value: 0, label: 'All' }, ...(mineData || []).map((item) => ({ value: item.id, label: item.name }))]}
            onChange={handleSelect}
            loading={isMineLoading}
            sx={{ width: '100%', minWidth: '130px' }}
          />
          <Select value={currentPage} onChange={(e) => handlePageChange(Number(e.target.value))} size="small" sx={{ minWidth: 120 }}>
            {Array.from({ length: totalPages }, (_, i) => {
              const start = i * pageSize + 1;
              const end = Math.min((i + 1) * pageSize, data.length);
              return (
                <MenuItem key={i + 1} value={i + 1}>
                  {start}-{end}
                </MenuItem>
              );
            })}
          </Select>
        </BidderBasicDetailsStackSelectContainer>
        {!loading.isProgress && data.length > 0 && (
          <CommonBidderActionButton {...{ isSubmitting, handleWithdraw, remainingTime, withdrawBidLoading }} />
        )}
      </BidderStackSelectMainContainer>
      <TableContainer sx={{ maxHeight: 430 }} className="print-table-container">
        <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
          <AllLotsTableHeader
            {...{
              order,
              orderBy,
              rowCount: data.length,
              numSelected: selected.length,
              onRequestSort: handleRequestSort,
              onSelectAllClick: handleSelectAllClick,
              eventCategory,
              eventTenderData,
              remainingTime,
            }}
          />
          <CommonBiddersTableBody
            {...{
              data: paginatedData,
              values,
              isSelected,
              handleClick,
              handleInputChange,
              handleManualPriceChange,
              handleBlur,
              loading,
              remainingTime,
              eventCategory,
              onSubmitForm: handleSubmitForm,
              onMediaMenuClick: handleMediaMenuClick,
              order,
              orderBy,
              eventTenderData,
            }}
          />
        </Table>
      </TableContainer>
    </>
  );
};

export default AllLotsTable;

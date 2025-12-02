'use client';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import CommonBiddersTableBody from '../CommonBiddersTableBody';
import SubmittedBidsTableHeader from './SubmittedBidsTableHeader';
import { useTableControls } from 'utils/useTableControls';
import { GetSubmittedBidsData } from 'services/bidder/submitted-bids/type';
import { SubmittedBidsTableProps } from 'types/table';
import { useBidInputLogic } from 'hooks/useBidInputLogic';

const SubmittedBidsTable = ({
  eventTenderData,
  data,
  values,
  loading,
  selected,
  setValues,
  handleBlur,
  isSelected,
  handleClick,
  handleSelectAllClick,
  eventCategory,
  remainingTime,
  handleSubmitForm,
  handleMediaMenuClick,
}: SubmittedBidsTableProps<GetSubmittedBidsData>) => {
  const { order, orderBy, handleRequestSort } = useTableControls('SeqNo');

  const isClosed = !loading?.isTimerLoading && !remainingTime;

  const { handleInputChange, handleManualPriceChange } = useBidInputLogic({
    data,
    values,
    setValues,
    isClosed,
  });

  return (
    <TableContainer sx={{ maxHeight: 430 }} className="print-table-container">
      <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
        <SubmittedBidsTableHeader
          {...{
            order,
            orderBy,
            rowCount: data.length,
            numSelected: selected.length,
            onRequestSort: handleRequestSort,
            onSelectAllClick: handleSelectAllClick,
            eventCategory,
            remainingTime,
            eventTenderData,
          }}
        />
        <CommonBiddersTableBody
          {...{
            data,
            values,
            loading,
            isSelected,
            handleClick,
            handleInputChange,
            handleBlur,
            onSubmitForm: handleSubmitForm,
            remainingTime,
            eventCategory,
            onMediaMenuClick: handleMediaMenuClick,
            handleManualPriceChange,
            order,
            orderBy,
            eventTenderData,
          }}
        />
      </Table>
    </TableContainer>
  );
};

export default SubmittedBidsTable;

'use client';
import { ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import { StyledTableCell, StyledTableRow, TenderHistoryContainer, TenderHistoryTableContainer } from './TenderBidsDetailsDialog.styled';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import { BIDDING_COLUMNS, isLotsData, LOT_COLUMNS_CATEGORY_1, LOT_COLUMNS_CATEGORY_2 } from 'constants/tenderBidsDetailsDialog.constants';
import { TenderHistoryDialogProps } from 'types/dialog';

const renderTableHead = (columns: { header: string; minWidth?: number }[]) => (
  <TableHead>
    <StyledTableRow>
      {columns.map((col, colIndex) => (
        <StyledTableCell key={colIndex} sx={{ minWidth: col.minWidth }}>
          {col.header}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  </TableHead>
);

const renderTableBody = <T,>(
  data: T[],
  columns: Array<{ accessor: (row: T) => ReactNode }>,
  getRowKey: (row: T, index: number) => string
) => (
  <TableBody>
    {data.map((row, rowIndex) => (
      <StyledTableRow key={getRowKey(row, rowIndex)}>
        {columns.map((col, colIndex) => {
          const value = col.accessor(row);
          return <StyledTableCell key={colIndex}>{value !== null && value !== undefined && value !== '' ? value : '-'}</StyledTableCell>;
        })}
      </StyledTableRow>
    ))}
  </TableBody>
);

const TenderBidsDetailsDialog = ({
  open,
  handleClose,
  eventCategoryID,
  cancelBiddingData,
  tenderHistoryData,
}: TenderHistoryDialogProps) => {
  const lotColumns = eventCategoryID === 1 ? LOT_COLUMNS_CATEGORY_1 : LOT_COLUMNS_CATEGORY_2;

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      content={
        <TenderHistoryContainer>
          {cancelBiddingData.length > 0 && (
            <TenderHistoryTableContainer>
              <Table aria-label="Lots Data Table">
                {renderTableHead(lotColumns)}
                {renderTableBody(
                  cancelBiddingData.flatMap((data) => (Array.isArray(data) && data.every(isLotsData) ? data : [])),
                  lotColumns,
                  (row, index) => `${row.SeqNo}-${index}`
                )}
              </Table>
            </TenderHistoryTableContainer>
          )}
          {tenderHistoryData.length > 0 && (
            <TenderHistoryTableContainer>
              <Table aria-label="Bidding Data Table">
                {renderTableHead(BIDDING_COLUMNS)}
                {renderTableBody(tenderHistoryData, BIDDING_COLUMNS, (row, index) => `${row.ranks}-${index}`)}
              </Table>
            </TenderHistoryTableContainer>
          )}
        </TenderHistoryContainer>
      }
    />
  );
};

export default TenderBidsDetailsDialog;

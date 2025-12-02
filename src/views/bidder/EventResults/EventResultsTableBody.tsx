'use client';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { EventResultsBidderBodyProps } from 'types/table';
import { GetWinnerAllLotsDetailsResponse } from 'services/bidder/all-lots/type';
import { renderTableCell, renderTableCellEllipsis, renderTableCellFixed } from 'utils/renderTableCell';
import { getComparator, stableSort } from 'utils/react-table';

const EventResultsTableBody = ({
  data,
  bidderLots,
  page,
  loading,
  rowsPerPage,
  order,
  orderBy,
}: EventResultsBidderBodyProps<GetWinnerAllLotsDetailsResponse>) => {
  const bidderStockNos: string[] = bidderLots.filter((b) => b?.FinalLotStatus === 'Accepted').map((b) => b?.stockNo);
  const renderRow = (row: any, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const isBidderRow = bidderStockNos.includes(row?.stockNo);

    return (
      <TableRow
        hover
        tabIndex={-1}
        key={index}
        sx={{
          backgroundColor: isBidderRow ? '#9BBB59' : 'inherit',
          boxShadow: isBidderRow ? '0px 2px 10px rgba(155, 187, 89, 0.3)' : 'none',
          transition: 'all 0.3s ease',
          position: 'relative',
          '&.MuiTableRow-hover:hover': { backgroundColor: isBidderRow ? '#87A648' : 'secondary.200' },
        }}
      >
        <TableCell component="th" id={labelId} scope="row" padding="none" width="50px" align="right">
          {page * rowsPerPage + index + 1}
        </TableCell>
        {renderTableCell({ content: row?.stockNo, width: '950px' })}
        {renderTableCell({ content: row?.Size, width: '950px' })}
        {renderTableCellEllipsis({ content: row?.stockDesc, width: '950px' })}
        {renderTableCell({ content: row?.pcs, width: '950px', align: 'right' })}
        {renderTableCellFixed({
          content: row?.cts,
          width: '950px',
          align: 'right',
          format: (value) => Number(value).toFixed(2),
        })}
        {renderTableCell({ content: row?.tenderresult, width: '950px', align: 'right' })}
        <TableCell width="950px">
          <Box display="flex" alignItems="center" gap={1} justifyContent="flex-end">
            {isBidderRow && (
              <Tooltip title="Congratulations! You won this lot 🎉" arrow>
                {/* Trophy Image */}
                <Box
                  component="img"
                  src="/assets/icons/trophy.png"
                  alt="Trophy"
                  sx={{
                    width: 20,
                    height: 20,
                    animation: 'pop 0.5s ease',
                  }}
                />
              </Tooltip>
            )}
            {row?.tenderresultVal}
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={8} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy)).map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={8} padding />
      )}
    </TableBody>
  );
};

export default EventResultsTableBody;

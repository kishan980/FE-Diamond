'use client';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import { EventAnalysingResultsDetailsData } from 'services/event/event-action/event-results/type';
import { EventAnalysisResultTableBodyProps } from 'types/table';
import { formatNumber } from 'utils/formatPercentage';

const EventAnalysingResultsDetailsTableBody = ({
  totals,
  loading,
}: EventAnalysisResultTableBodyProps<EventAnalysingResultsDetailsData>) => {
  const rows = [
    {
      name: 'Number of Lots',
      Offered: totals.totalLots,
      Sold: totals.soldDataCount,
      WithDrawn: totals.withdrawnDataCount,
      NoBids: totals.noBidDataCount,
    },
    {
      name: 'Carats',
      Offered: `${formatNumber(totals.totalCarats)}  ct`,
      Sold: `${formatNumber(totals.soldTotalCarats)}  ct`,
      WithDrawn: `${formatNumber(totals.withdrawnTotalCarats)}  ct`,
      NoBids: `${formatNumber(totals.noBidTotalCarats)}  ct`,
    },
    {
      name: 'Highest Bid Value',
      Offered: `${formatNumber(totals.totalWinRate)}  $ `,
      Sold: `${formatNumber(totals.soldTotalWinRate)}  $ `,
      WithDrawn: `${formatNumber(totals.withdrawnTotalWinRate)}  $ `,
      NoBids: `${formatNumber(totals.noBidTotalWinRate)}  $ `,
    },
    {
      name: 'Reserve Price Value',
      Offered: `${formatNumber(totals.totalReserveValue)}  $ `,
      Sold: `${formatNumber(totals.soldTotalReserve)}  $ `,
      WithDrawn: `${formatNumber(totals.withdrawnTotalReserve)}  $ `,
      NoBids: `${formatNumber(totals.noBidTotalReserve)}  $ `,
    },
    {
      name: 'Variance Highest Bid / Reserve Value',
      Offered: `${formatNumber(totals.totalHighestReserveValue)}  % `,
      Sold: `${formatNumber(totals.soldHighestReserveValue)}  % `,
      WithDrawn: `${formatNumber(totals.withdrawnHighestReserveValue)}  % `,
      NoBids: `${formatNumber(totals.noBidHighestReserveValue)}  % `,
    },
    {
      name: 'Highest Bid Average US$/ct.',
      Offered: `${formatNumber(totals.totalHighestAverage)}  $/ct `,
      Sold: `${formatNumber(totals.soldHighestAverage)}  $/ct `,
      WithDrawn: `${formatNumber(totals.withdrawnHighestAverage)}  $/ct `,
      NoBids: `${formatNumber(totals.noBidHighestAverage)}  $/ct `,
    },
    {
      name: 'Reserve Price Average US$/ct.',
      Offered: `${formatNumber(totals.totalReservePriceAverage)}  $/ct `,
      Sold: `${formatNumber(totals.soldReservePriceAverage)}  $/ct `,
      WithDrawn: `${formatNumber(totals.withdrawnReservePriceAverage)}  $/ct `,
      NoBids: `${formatNumber(totals.noBidReservePriceAverage)}  $/ct `,
    },
  ];

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={5} />
      ) : rows?.length > 0 ? (
        rows.map((row, index) =>
          row ? (
            <TableRow
              key={row?.name}
              sx={{
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#C8C8C8',
                '&:last-child td, &:last-child th': {
                  border: 0,
                },
              }}
            >
              <TableCell component="th" scope="row">
                {row?.name}
              </TableCell>
              <TableCell align="right">{row?.Offered}</TableCell>
              <TableCell align="right">{row?.Sold}</TableCell>
              <TableCell align="right">{row?.WithDrawn}</TableCell>
              <TableCell align="right">{row?.NoBids}</TableCell>
            </TableRow>
          ) : null
        )
      ) : (
        <NoDataTableRow colSpan={5} padding />
      )}
    </TableBody>
  );
};

export default EventAnalysingResultsDetailsTableBody;

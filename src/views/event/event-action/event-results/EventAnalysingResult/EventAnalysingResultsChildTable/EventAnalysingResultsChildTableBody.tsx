'use client';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import { renderTableCell, renderTableCellClick } from 'utils/renderTableCell';
import { EventAnalysingResultsChildTableBodyProps } from 'types/table';
import { GetBidResultSummaryData, RankingDataWrapper } from 'services/event/event-action/event-results/type';
import { formatNumber } from 'utils/formatPercentage';

const EventAnalysingResultsChildTableBody = ({
  loading,
  getBidResultsSummary,
  showOverAllPurchaseLimit,
  handleProfileDetailsReadClick,
}: EventAnalysingResultsChildTableBodyProps<GetBidResultSummaryData>) => (
  <TableBody>
    {loading.isProgress || loading.isLoading ? (
      <LoadingTableRow colSpan={8} />
    ) : getBidResultsSummary &&
      getBidResultsSummary
        .filter((data): data is RankingDataWrapper => 'RankingData' in data)
        .reduce((total, item) => total + item.RankingData.length, 0) > 0 ? (
      getBidResultsSummary
        .filter((data): data is RankingDataWrapper => 'RankingData' in data)
        .map((rankingWrapper, index) =>
          rankingWrapper.RankingData.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#C8C8C8',
                '&:last-child td, &:last-child th': {
                  border: 0,
                },
              }}
            >
              {renderTableCell({ content: row?.rank1 })}
              {renderTableCellClick({ content: row?.co_name, onClick: () => handleProfileDetailsReadClick(row?.refWinnerID_EntityMas) })}
              {renderTableCell({ content: row?.nos, align: 'right' })}
              {renderTableCell({
                content: formatNumber(row?.lt),
                align: 'right',
              })}
              {renderTableCell({ content: showOverAllPurchaseLimit === 'Yes' ? row?.purchaseLimit : 'Not Defined', align: 'right' })}
              {renderTableCell({ content: '-', align: 'right' })}
            </TableRow>
          ))
        )
    ) : (
      <NoDataTableRow colSpan={8} padding />
    )}
  </TableBody>
);

export default EventAnalysingResultsChildTableBody;

'use client';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { EventAnalysingChildUpperTableContainer, EventAnalysingChildUpperTableMainContainer } from '../EventAnalysingResults.styled';
import { EventAnalysingResultsChildUpperTableProps } from 'types/table';
import { GetBidResultSummaryData } from 'services/event/event-action/event-results/type';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';

const EventAnalysingResultsChildUpperTable = ({
  getBidResultsSummary,
  loading,
}: EventAnalysingResultsChildUpperTableProps<GetBidResultSummaryData>) => {
  const findValueByKey = (key: string) => {
    const item = getBidResultsSummary.find((item) => key in item);
    return item ? (item as Record<string, number>)[key] : 0;
  };

  const formatValue = (key: string, defaultValue: string | number = 0) => {
    const item = getBidResultsSummary.find((item) => key in item);
    const value = item ? (item as Record<string, string | number>)[key] : defaultValue;
    return typeof value === 'number' ? value.toFixed(2) : value;
  };

  const rows = [
    { name: 'Number of Attendees', value: findValueByKey('NumberOfAttendees') },
    { name: 'Number of Bidders', value: findValueByKey('NumberOfBidders') },
    { name: 'Number of Bids', value: findValueByKey('NumberOfBids') },
    { name: 'Number of Winning Bidders', value: findValueByKey('NumberOfWinningBidders') },
  ];

  const secondRows = [
    {
      name: 'Number of Bidders / Number of Attendees',
      value: formatValue('NumberOfBiddersPercentage'),
    },
    {
      name: 'Average Number of Bids per Lot',
      value: formatValue('AvgNumOfBidsPerLot'),
    },
    {
      name: 'Average Number of Bids per Bidder',
      value: formatValue('AvgNumOfBidsPerBidder'),
    },
    {
      name: 'Number of Winning Bidders / Number of Bidders',
      value: formatValue('NumberOfWinningBiddersPercentage'),
    },
  ];
  return (
    <EventAnalysingChildUpperTableMainContainer>
      <EventAnalysingChildUpperTableContainer>
        <Paper>
          <Table>
            <TableBody>
              {loading.isProgress || loading.isLoading ? (
                <LoadingTableRow colSpan={2} />
              ) : rows?.length > 0 ? (
                rows.map((row, index) =>
                  row ? (
                    <TableRow
                      key={row?.name}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#C8C8C8',
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }}>
                        {row?.name}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="right">
                        {row?.value}
                      </TableCell>
                    </TableRow>
                  ) : null
                )
              ) : (
                <NoDataTableRow colSpan={2} padding />
              )}
            </TableBody>
          </Table>
        </Paper>
      </EventAnalysingChildUpperTableContainer>

      <EventAnalysingChildUpperTableContainer>
        <Paper>
          <Table>
            <TableBody>
              {loading.isProgress || loading.isLoading ? (
                <LoadingTableRow colSpan={2} />
              ) : secondRows?.length > 0 ? (
                secondRows.map((row, index) =>
                  row ? (
                    <TableRow
                      key={row?.name}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#C8C8C8',
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }}>
                        {row?.name}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="right">
                        {row?.name.includes('Number of Bidders') || row?.name.includes('Number of Winning Bidders')
                          ? `${row?.value}%`
                          : row?.value}
                      </TableCell>
                    </TableRow>
                  ) : null
                )
              ) : (
                <NoDataTableRow colSpan={2} padding />
              )}
            </TableBody>
          </Table>
        </Paper>
      </EventAnalysingChildUpperTableContainer>
    </EventAnalysingChildUpperTableMainContainer>
  );
};

export default EventAnalysingResultsChildUpperTable;

'use client';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { CloseCircle } from 'iconsax-react';
import {
  EventAnalysingChildbuttonContainer,
  EventAnalysingChildMiddleTableContainer,
  EventAnalysingChildTableMainContainer,
} from '../EventAnalysingResults.styled';
import EventAnalysingResultsChildTableBody from './EventAnalysingResultsChildTableBody';
import EventAnalysingResultsChildUpperTable from './EventAnalysingResultsChildUpperTable';
import EventAnalysingResultsChildTableHeader from './EventAnalysingResultsChildTableHeader';
import { GetBidResultSummaryData, RankingDataWrapper } from 'services/event/event-action/event-results/type';
import { EventResultsBidderTableProps } from 'types/table';

const EventAnalysingResultsChildTable = ({
  loading,
  getBidResultsSummary,
  isPubliciseResults,
  showOverAllPurchaseLimit,
  handleProfileDetailsReadClick,
  handleActionClick,
}: EventResultsBidderTableProps<GetBidResultSummaryData>) => (
  <EventAnalysingChildTableMainContainer>
    <EventAnalysingResultsChildUpperTable getBidResultsSummary={getBidResultsSummary} loading={loading} />

    {getBidResultsSummary &&
      getBidResultsSummary
        .filter((data): data is RankingDataWrapper => 'RankingData' in data)
        .reduce((acc, curr) => acc + curr.RankingData.length, 0) > 0 && (
        <EventAnalysingChildMiddleTableContainer>
          <Paper>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
              <EventAnalysingResultsChildTableHeader />
              <EventAnalysingResultsChildTableBody
                loading={loading}
                getBidResultsSummary={getBidResultsSummary}
                showOverAllPurchaseLimit={showOverAllPurchaseLimit}
                handleProfileDetailsReadClick={handleProfileDetailsReadClick}
              />
            </Table>
          </Paper>
        </EventAnalysingChildMiddleTableContainer>
      )}

    <EventAnalysingChildbuttonContainer>
      {isPubliciseResults ? (
        <>
          <Button
            variant="contained"
            onClick={() =>
              handleActionClick('No', 'Are you sure that you want to close this event WITHOUT publicising the tender outcomes to bidders?')
            }
            startIcon={<CloseCircle />}
          >
            Close this event WITHOUT publicising outcomes to bidders
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleActionClick('Yes', 'Are you sure that you want to publicise this event outcomes to bidders?')}
            startIcon={<CloseCircle />}
          >
            Close this event and publicise outcomes to bidders
          </Button>
        </>
      ) : (
        <Box>
          <Button
            variant="contained"
            onClick={() =>
              handleActionClick('No', 'Are you sure that you want to close this event WITHOUT publicising the tender outcomes to bidders?')
            }
            startIcon={<CloseCircle />}
          >
            Close this event WITHOUT publicising outcomes to bidders
          </Button>
        </Box>
      )}
    </EventAnalysingChildbuttonContainer>
  </EventAnalysingChildTableMainContainer>
);

export default EventAnalysingResultsChildTable;

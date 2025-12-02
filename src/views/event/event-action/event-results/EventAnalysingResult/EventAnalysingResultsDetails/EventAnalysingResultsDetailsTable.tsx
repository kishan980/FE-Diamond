'use client';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { EventAnalysingResultsDetailsTableContainer } from '../EventAnalysingResults.styled';
import EventAnalysingResultsDetailsTableBody from './EventAnalysingResultsDetailsTableBody';
import EventAnalysingResultsDetailsTableHeader from './EventAnalysingResultsDetailsTableHeader';
import { EventAnalysingResultsDetailsData } from 'services/event/event-action/event-results/type';
import { EventAnalysisResultTableBodyProps } from 'types/table';

const EventAnalysingResultsDetailsTable = ({ totals, loading }: EventAnalysisResultTableBodyProps<EventAnalysingResultsDetailsData>) => (
  <EventAnalysingResultsDetailsTableContainer>
    <Paper>
      <Table sx={{ minWidth: 650 }}>
        <EventAnalysingResultsDetailsTableHeader />
        <EventAnalysingResultsDetailsTableBody totals={totals} loading={loading} />
      </Table>
    </Paper>
  </EventAnalysingResultsDetailsTableContainer>
);

export default EventAnalysingResultsDetailsTable;

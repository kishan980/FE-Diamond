import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import React from 'react';
import EventCollapsibleAnalysingTableHeader from './EventCollapsibleAnalysingTableHeader';
import EventCollapsibleAnalysingTableBody from './EventCollapsibleAnalysingTableBody';
import MainCard from 'components/MainCard';
import { EventCollapsibleAnalysingTableProps } from 'types/table';
import { GetSameBidEventData } from 'services/event/event-action/event-results/type';
import { useTableControls } from 'utils/useTableControls';

const EventCollapsibleAnalysingTable = ({
  bidEventData,
  eventId,
  fetchGetBidEventData,
  fetchBidDetails,
  loading,
  setLoading,
  eventCategoryID,
  handleProfileDetailsReadClick,
}: EventCollapsibleAnalysingTableProps<GetSameBidEventData>) => {
  const { order, orderBy, handleRequestSort } = useTableControls('stockNo');

  return (
    <MainCard content={false} title="Equal bids">
      <TableContainer sx={{ mb: 2 }}>
        <Table aria-label="collapsible table">
          <EventCollapsibleAnalysingTableHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            eventCategoryID={eventCategoryID}
          />
          <EventCollapsibleAnalysingTableBody
            data={bidEventData}
            loading={loading}
            setLoading={setLoading}
            eventId={eventId}
            eventCategoryID={eventCategoryID}
            fetchGetBidEventData={fetchGetBidEventData}
            fetchBidDetails={fetchBidDetails}
            handleProfileDetailsReadClick={handleProfileDetailsReadClick}
            order={order}
            orderBy={orderBy}
          />
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default EventCollapsibleAnalysingTable;

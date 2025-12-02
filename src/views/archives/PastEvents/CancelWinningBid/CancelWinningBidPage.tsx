'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import CancelWinningBidBody from './CancelWinningBidBody';
import CancelBiddingBidTable from './CancelBiddingBidTable';
import CancelWinningBidHeader from './CancelWinningBidHeader';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';
import { useTableControls } from 'utils/useTableControls';
import { PastEventsServices } from 'services/archives/pastEvents/pastEvents.services';
import { EventResultsServices } from 'services/event/event-action/event-results/eventResults.services';
import { LoadingState } from 'types/table';
import { UpdateBidConsiderParams } from 'services/event/event-action/event-results/type';
import { GetCancelBiddingData, GetTenderHistoryParams, UpdatePastEventsRealLocateBidParams } from 'services/archives/pastEvents/types';
import PrintLogo from 'components/logo/PrintLogo';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import ProfileDetailsReadModal from 'views/profileDetails-Model/ProfileDetailsReadModal';

const CancelWinningBidPage = () => {
  const searchParams = useSearchParams();

  const seqID = Number(searchParams.get('seqId'));
  const eventId = Number(searchParams.get('eventId'));
  const eventCategoryID = Number(searchParams.get('eventCategoryID'));

  const [cancelBiddingData, setCancelBiddingData] = useState<GetCancelBiddingData[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState(0);
  const [selectedSeqNo, setSelectedSeqNo] = useState(0);
  const [selectedBidValue, setSelectedBidValue] = useState(0);
  const [statusLabel, setStatusLabel] = useState('');

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isAcceptReallocateModel, setIsAcceptReallocateModel] = useState(false);
  const [isProfileDetailsDialogOpen, setIsProfileDetailsDialogOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [sellerID, setSellerID] = useState<number | null>(null);

  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isConfirmLoading: false });

  const { order, orderBy, handleRequestSort } = useTableControls('SeqNo');

  const fetchCancelWinningBidData = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const params: GetTenderHistoryParams = { eventId, seqNo: seqID };
      const res = await PastEventsServices.GetCancelBiddingData(params);

      if (typeof res !== 'string' && res.success) setCancelBiddingData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching cancel bid data:', error);
      toast.error('An error occurred while fetching cancel bid data');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const handleReallocateBid = async () => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));
    try {
      const params: UpdatePastEventsRealLocateBidParams = {
        eventId,
        seqNo: selectedSeqNo,
        bidValue: selectedBidValue,
        entityId: selectedEntityId,
      };

      const res = await PastEventsServices.pastEventRealLocateBid(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('Bid successfully relocated');
        fetchCancelWinningBidData();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in handleReallocateBid', e);
      toast.error('An error occurred while relocating the bid');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
  };

  const handleWithdrawBid = async () => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));

    const bidConsiderParams: UpdateBidConsiderParams = { seqNo: selectedSeqNo, eventId, finalStatus: statusLabel };
    try {
      const res = await EventResultsServices.bidConsiderEvent(bidConsiderParams);
      if (typeof res !== 'string' && res.success) {
        toast.success('Lot successfully accepted');
        fetchCancelWinningBidData();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error withdrawing bid:', error);
      toast.error('An error occurred while withdrawing the lot');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
  };

  const handleDialogConfirm = () => {
    setIsConfirmDialogOpen(false);
    if (isAcceptReallocateModel) {
      handleReallocateBid();
    } else {
      handleWithdrawBid();
    }
  };

  const hanleOpenReallocateBidModel = (seqNo: number, bidValue: number, entityId: number) => {
    setSelectedSeqNo(seqNo);
    setSelectedBidValue(bidValue);
    setSelectedEntityId(entityId);
    setModalMessage('Are you sure you want to cancel the winning bid and reallocate the lot to this bidder?');
    setIsAcceptReallocateModel(true);
    setIsConfirmDialogOpen(true);
  };

  const handleOpenWithDrawAndAcceptBid = (status: string, seqNo: number) => {
    setStatusLabel(status);
    setSelectedSeqNo(seqNo);
    setModalMessage(
      status === 'Accepted'
        ? 'Are you sure you want to accept this bid?'
        : 'Are you sure you want to cancel the winning bid and withdraw the lot?'
    );
    setIsAcceptReallocateModel(false);
    setIsConfirmDialogOpen(true);
  };

  const handleProfileDetailsReadClick = (sellerID: number) => {
    setSellerID(sellerID);
    setIsProfileDetailsDialogOpen(true);
  };
  useEffect(() => {
    fetchCancelWinningBidData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <PrintLogo />
      <MainCard
        content={false}
        title="Cancel Winning Bid"
        headerClassName="print-card-hidden-title"
        secondary={<PrintIconButton title="Print" onClick={() => window.print()} />}
      >
        <TableContainer sx={{ maxHeight: 430 }} className="print-table-container">
          <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
            <CancelWinningBidHeader {...{ order, orderBy, onRequestSort: handleRequestSort, eventCategoryID }} />
            <CancelWinningBidBody {...{ data: cancelBiddingData, eventCategoryID, loading }} />
          </Table>
        </TableContainer>
      </MainCard>
      <CancelBiddingBidTable
        data={cancelBiddingData}
        handleReallocateBid={hanleOpenReallocateBidModel}
        handleWithdrawBid={handleOpenWithDrawAndAcceptBid}
        loading={loading}
        handleProfileDetailsReadClick={handleProfileDetailsReadClick}
      />
      <ProfileDetailsReadModal
        open={isProfileDetailsDialogOpen}
        handleClose={() => setIsProfileDetailsDialogOpen(false)}
        entityID={sellerID}
      />
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDialogConfirm}
        loading={loading}
        title={modalMessage}
      />
    </>
  );
};

export default CancelWinningBidPage;

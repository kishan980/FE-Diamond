'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ProfileDetailsModal from './ProfileDetailsModal';
import ViewTermsAndConditionsModal from './ViewTermsAndConditionsModal';
import { EventServices } from 'services/event/event.services';
import { TermsAndConditionServices } from 'services/parameter/termsAndCondition/termsAndCondition.services';
import {
  GetTermsAndConditionParams,
  TermConditionAgreementItem,
  TermConditionItem,
  UpdateStatusTermsConditionParams,
} from 'services/parameter/termsAndCondition/type';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { GetViewParticipateData, ViewParticipateParams } from 'services/bidder/my-profile/type';
import { LoadingState } from 'types/table';
import { OverallPurchaseLimitBidderServices } from 'services/bidder/overall-purchase-limit/overallPurchaseLimit.services';
import { GetOverallPurchaseLimitData } from 'services/bidder/overall-purchase-limit/type';

const BidderModal = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const eventId = Number(id);
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { entityID, companyID, termsConditionID } = imageDetails?.currentUserDetails ?? {};

  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [isProfileDetailsDialogOpen, setIsProfileDetailsDialogOpen] = useState(false);
  const [termAndConditionItem, setTermsAndConditionItem] = useState<TermConditionItem[]>([]);
  const [termAndConditionnAgreementItem, setTermsAndConditionnAgreementItem] = useState<TermConditionAgreementItem[]>([]);
  const [eventTenderData, setEventTenderData] = useState<GetViewParticipateData[]>([]);
  const [overallLimitData, setOverallLimitData] = useState<GetOverallPurchaseLimitData>();
  const [showOverAllPurchaseLimit, setShowOverAllPurchaseLimit] = useState<string>('');
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isConfirmLoading: false });

  const handleTermsAndConditionClick = async (actionType: 'Accept' | 'Decline') => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));

    const params: UpdateStatusTermsConditionParams = {
      eventId,
      entityId: entityID,
      termsConditionId: termsConditionID,
      agreementStatus: actionType,
      insUserId: entityID,
    };
    try {
      await TermsAndConditionServices.updateStatusTermsCondition(params);
      if (actionType === 'Accept') {
        const limit = overallLimitData?.maximumPurchaseLimit ?? 0;
        const url =
          showOverAllPurchaseLimit === 'Yes'
            ? `/bidder/${eventId}/purchase-limit?maximumPurchaseLimit=${limit}&showOverAllPurchaseLimit=${showOverAllPurchaseLimit}`
            : `/bidder/${eventId}/all-lots`;
        router.push(url);
        setIsTermsDialogOpen(false);
      } else {
        await signOut({ redirect: false });
        router.push('/');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while updating terms and conditions:', error);
      toast.error('An error occurred while updating terms and conditions.');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
  };

  const fetchInitialData = useCallback(async () => {
    try {
      const termsParams: GetTermsAndConditionParams = { eventId, entityId: entityID };
      const eventParams: ViewParticipateParams = {
        entityId: Number(entityID),
        companyId: companyID,
        eventId,
      };
      const limitParams = { bidderId: Number(entityID), eventId };

      const [termsRes, eventRes, limitRes, eventByIdRes] = await Promise.all([
        TermsAndConditionServices.getTermsConditionEventById(termsParams),
        MyProfileServices.getOngoingTenders(eventParams),
        OverallPurchaseLimitBidderServices.getOverAllPuchaseLimit(limitParams),
        EventServices.getEventById(eventId),
      ]);

      if (typeof termsRes !== 'string' && termsRes.success) {
        setTermsAndConditionItem(termsRes.data.termConditionData.flat() ?? []);
        setTermsAndConditionnAgreementItem(termsRes.data.termConditionAgreementData ?? []);
      }
      if (typeof eventRes !== 'string' && eventRes.success) setEventTenderData(eventRes.data);
      if (typeof limitRes !== 'string' && limitRes.success) setOverallLimitData(limitRes.data);
      if (typeof eventByIdRes !== 'string' && eventByIdRes.success) setShowOverAllPurchaseLimit(eventByIdRes.data.showOverAllPurchaseLimit);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Failed to fetch data:', error);
      toast.error('Failed to fetch data.');
    }
  }, [entityID, companyID, eventId]);

  useEffect(() => {
    if (eventId) {
      fetchInitialData();
    }
  }, [eventId, fetchInitialData]);

  useEffect(() => {
    if (!eventTenderData.length || !showOverAllPurchaseLimit) return;

    try {
      if (eventTenderData[0]?.IsAccept === false) {
        setIsProfileDetailsDialogOpen(true);
      } else if (termAndConditionnAgreementItem[0]?.AgreementStatus !== 'Accept') {
        setIsTermsDialogOpen(true);
      } else if (eventTenderData[0]?.showPurchaseLimit === 'Yes') {
        const limit = overallLimitData?.maximumPurchaseLimit ?? 0;
        router.push(
          `/bidder/${eventId}/purchase-limit?maximumPurchaseLimit=${JSON.stringify(limit)}&showOverAllPurchaseLimit=${showOverAllPurchaseLimit}`
        );
      } else {
        router.push(`/bidder/${eventId}/all-lots`);
      }
    } catch (error) {
      setIsProfileDetailsDialogOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, eventTenderData, showOverAllPurchaseLimit]);

  return (
    <>
      <ViewTermsAndConditionsModal
        open={isTermsDialogOpen}
        handleClose={() => setIsTermsDialogOpen(false)}
        handleAcceptClick={() => handleTermsAndConditionClick('Accept')}
        handleDeclineClick={() => handleTermsAndConditionClick('Decline')}
        termAndConditionItem={termAndConditionItem}
        loading={loading}
      />
      <ProfileDetailsModal
        open={isProfileDetailsDialogOpen}
        handleClose={() => setIsProfileDetailsDialogOpen(false)}
        entityID={entityID}
        eventId={eventId}
        setIsViewParticipateDialogOpen={setIsTermsDialogOpen}
        termAndConditionnAgreementItem={termAndConditionnAgreementItem}
        eventTenderData={eventTenderData}
      />
    </>
  );
};

export default BidderModal;

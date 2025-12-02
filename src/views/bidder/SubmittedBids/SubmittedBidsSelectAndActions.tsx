'use client';
import { BidderBasicDetailsStackSelectContainer, BidderStackSelectMainContainer } from '../CommonBidder.styled';
import CommonBidderActionButton from '../CommonBidderActionButton';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { GetSubmittedBidsData } from 'services/bidder/submitted-bids/type';
import { SubmittedBidsSelectAndActionsProps } from 'types/bidder';

const SubmittedBidsSelectAndActions = ({
  isMineLoading,
  mineData,
  selectedMineID,
  handleSelect,
  isSubmitting,
  handleWithdraw,
  data,
  remainingTime,
  withdrawBidLoading,
  loading,
}: SubmittedBidsSelectAndActionsProps<GetSubmittedBidsData>) => {
  return (
    <BidderStackSelectMainContainer className="print-filter-hidden-container">
      <BidderBasicDetailsStackSelectContainer>
        <SelectFormControl
          label="Select Mine"
          id="mine-select"
          value={selectedMineID}
          options={[{ value: 0, label: 'All' }, ...(mineData || []).map((item) => ({ value: item.id, label: item.name }))]}
          onChange={handleSelect}
          loading={isMineLoading}
          sx={{ width: '100%', minWidth: '130px' }}
        />
      </BidderBasicDetailsStackSelectContainer>
      {!loading?.isProgress && data.length > 0 && (
        <CommonBidderActionButton {...{ isSubmitting, handleWithdraw, remainingTime, withdrawBidLoading }} />
      )}
    </BidderStackSelectMainContainer>
  );
};

export default SubmittedBidsSelectAndActions;

'use client';
import SelectAndActionButton from './SelectAndActionButton';
import { EventUploadPaperSearchButtonContainer, EventUploadPaperSearchContainer } from './UploadPaperBids.styled';
import SelectedChip from 'components/UIComponent/SelectedChip/SelectedChip';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { GetBidderListData } from 'services/event/event-action/event-results/type';
import { SelectAndActionsBidsProps } from 'types/bidder';

const SelectAndActionBids = ({
  data,
  id,
  selected,
  isSubmitting,
  handleWithdraw,
  selectedID,
  handleSelect,
  withdrawBidLoading,
}: SelectAndActionsBidsProps<GetBidderListData>) => (
  <EventUploadPaperSearchButtonContainer className="print-filter-hidden-container">
    <EventUploadPaperSearchContainer>
      <SelectFormControl
        label="Select bidder"
        id={id}
        value={selectedID}
        options={data?.flat().map((item) => ({ value: item.refBuyerID_EntityMas, label: item.namee }))}
        onChange={handleSelect}
        sx={{ width: '100%', minWidth: '130px' }}
      />
      {selected.length > 0 && <SelectedChip count={selected.length} />}
    </EventUploadPaperSearchContainer>
    <SelectAndActionButton isSubmitting={isSubmitting} handleWithdraw={handleWithdraw} withdrawBidLoading={withdrawBidLoading} />
  </EventUploadPaperSearchButtonContainer>
);

export default SelectAndActionBids;

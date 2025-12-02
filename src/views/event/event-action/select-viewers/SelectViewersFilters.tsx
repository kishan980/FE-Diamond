'use client';

import { useParams, usePathname } from 'next/navigation';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import { ViewSelectMainContainer } from './SelectViewers.styled';
import { EVENT_MENU_ITEMS, INVITATION_TYPE_OPTIONS, LOGIN_STATUS_OPTIONS } from 'constants/event.constants';
import { SelectViewersFiltersProps } from 'types/selectDropDown';
import { EventServices } from 'services/event/event.services';
import { EventByIdData } from 'services/event/types';
import MoreIcon from 'components/@extended/MoreIcon';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import DocumentActionMenu from 'views/event/DocumentActionMenu';
import { MenuDetails } from 'types/events';

const SelectViewersFilters = ({
  invited,
  loginEnabled,
  handleChangeInvited,
  handleChangeLoginEnabled,
  isDropdownEnabled,
}: SelectViewersFiltersProps) => {
  const { id } = useParams();
  const eventId = Number(id);

  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [eventData, setEventData] = useState<EventByIdData | null>(null);
  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const handleFetchEventDetails = async (id: number) => {
      if (!id) return;
      try {
        const res = await EventServices.getEventById(id);
        if (typeof res !== 'string' && res.success) setEventData(res.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching event details:', error);
        toast.error('Failed to fetch basic details');
      }
    };
    handleFetchEventDetails(eventId);
  }, [eventId]);

  const handleClickMoreMenuButton = (
    event: MouseEvent<HTMLElement>,
    eventID: number,
    startDate: string,
    endDate: string,
    eventCategoryID: number,
    isAnalysis: boolean,
    TenderEndDate: string,
    AuctionEndDate: string,
    ISAuction: string
  ) => {
    setAnchorElMore(event.currentTarget);
    setMenuDetails({ EventID: eventID, startDate, endDate, eventCategoryID, isAnalysis, TenderEndDate, AuctionEndDate, ISAuction });
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
    setMenuDetails(null);
  };

  const pathname = usePathname();
  const filteredMenu = useMemo(() => EVENT_MENU_ITEMS.filter((item) => !pathname.includes(item.path)), [pathname]);

  return (
    <ViewSelectMainContainer>
      <SelectFormControl
        label="Invited?"
        value={invited}
        onChange={handleChangeInvited}
        options={INVITATION_TYPE_OPTIONS.map((item) => ({ value: item.id, label: item.name }))}
        id="invited"
        disabled={!isDropdownEnabled}
      />
      <SelectFormControl
        label="Login Enabled?"
        value={loginEnabled}
        onChange={handleChangeLoginEnabled}
        options={LOGIN_STATUS_OPTIONS.map((item) => ({ value: item.id, label: item.name }))}
        id="loginEnabled"
        disabled={!isDropdownEnabled}
      />
      <IconButton
        edge="end"
        aria-label="comments"
        color="secondary"
        onClick={(e) =>
          handleClickMoreMenuButton(
            e,
            eventData?.auTen_EvtId || 0,
            eventData?.startDate || '',
            eventData?.EndDate || '',
            eventData?.refEventCategoryID_EventCategoryMas || 0,
            eventData?.IsAnalysing || false,
            eventData?.TenderEndDate || '',
            eventData?.AuctionEndDate || '',
            eventData?.ISAuction || ''
          )
        }
      >
        <MoreIcon />
      </IconButton>
      <DocumentActionMenu
        open={Boolean(anchorElMore)}
        anchorElMoreMenu={anchorElMore}
        moreMenuEventID={menuDetails?.EventID}
        moreMenuStartDate={menuDetails?.startDate}
        moreMenuEndDate={menuDetails?.endDate}
        eventCategories={menuDetails?.eventCategoryID}
        handleCloseMoreMenuButton={handleCloseMoreMenu}
        detailPageMoreMenuItems={filteredMenu}
        eventOutcomesUrl={menuDetails?.isAnalysis}
        moreMenuTenderEndDate={menuDetails?.TenderEndDate}
        moreMenuAuctionEndDate={menuDetails?.AuctionEndDate}
        moreMenuIsAuction={menuDetails?.ISAuction}
      />
    </ViewSelectMainContainer>
  );
};

export default SelectViewersFilters;

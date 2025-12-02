import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Calendar, Clock } from 'iconsax-react';
import Avatar from '@mui/material/Avatar';
import { MouseEvent, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import DocumentActionMenu from '../DocumentActionMenu';
import { EventCardList, EventCardListItemTextBox } from '../Event.styled';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { EventData } from 'services/event/types';
import { formatDate, formatDateAndTime, formatTime } from 'utils/format-date';
import { EventTimeBox } from 'sections/auth/AuthSlider/AuthSlider.styled';
import StatusChip from 'components/UIComponent/StatusChip';
import { EVENT_TYPE } from 'constants/event.constants';
import { MenuDetails } from 'types/events';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';

const EventCard = ({ event, auctionDurations }: { event: EventData; auctionDurations: { [key: number]: string } }) => {
  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));

  const getStatusChip = (status: string) => {
    const statusMap = {
      'Upcoming<br/> Event': { color: 'success', label: 'Upcoming Event' },
      'Ongoing<br/>Tender': { color: 'info', label: 'Ongoing Tender' },
      'Auction<br/>Pending': { color: 'warning', label: 'Auction Pending' },
      'Ongoing<br/>Auction': { color: 'primary', label: 'Ongoing Auction' },
      'Closed<br/> Event': { color: 'error', label: 'Closed Event' },
    };

    if (status in statusMap) {
      const { color, label } = statusMap[status as keyof typeof statusMap];
      return <StatusChip color={color as any} label={label} />;
    }

    return <StatusChip color="default" label={status} />;
  };

  const handleClickMoreMenuButton = (
    event: MouseEvent<HTMLElement>,
    eventID: number,
    startDate: string,
    endDate: string,
    eventCategoryID: number,
    isAnalysis: boolean,
    TenderEndDate: string,
    AuctionEndDate: string,
    EnbleAuctionLink: string
  ) => {
    setAnchorElMore(event.currentTarget);
    setMenuDetails({ EventID: eventID, startDate, endDate, eventCategoryID, isAnalysis, TenderEndDate, AuctionEndDate, EnbleAuctionLink });
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
    setMenuDetails(null);
  };

  return (
    <>
      <MainCard sx={{ height: 1, '.MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={1}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                sx={{ '& .MuiListItemSecondaryAction-root': { top: 16 } }}
                secondaryAction={
                  <EventCardListItemTextBox>
                    <Link href={`/events/upsert-event/${event.EventID}`}>
                      <EditIconButton title="Edit Event" />
                    </Link>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      color="secondary"
                      onClick={(e) =>
                        handleClickMoreMenuButton(
                          e,
                          event.EventID,
                          event.startDate,
                          event.EndDate,
                          event.EventCategoryID,
                          event.IsAnalysing,
                          event.TenderEndDate,
                          event.AuctionEndDate,
                          event.EnbleAuctionLink
                        )
                      }
                    >
                      <MoreIcon />
                    </IconButton>
                  </EventCardListItemTextBox>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: 'primary.main' }} src={event.ShowSellerLogo === 'Yes' ? event.co_logo : ''}>
                    {event.ShowSellerLogo !== 'Yes' && <Calendar size={24} />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant="subtitle1">#{event.EventID}</Typography>
                      <Divider orientation="vertical" flexItem sx={{ height: '20px' }} />
                      <Typography variant="body1" color={event.EventCategory === EVENT_TYPE.ROUGH ? 'success.main' : 'primary.main'}>
                        {event.EventCategory}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxWidth={200}>
                      {event.co_name}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
              <Grid item xs={12}>
                <EventCardList>
                  <ListItem alignItems="center">
                    <ListItemText
                      primary={
                        <EventCardListItemTextBox>
                          {getStatusChip(event.STATUS ?? '')}
                          {event.STATUS === 'Upcoming<br/> Event' && (
                            <Typography color="success.main" fontWeight={500}>
                              {auctionDurations[event.EventID] || ''}
                            </Typography>
                          )}
                          {event.STATUS === 'Ongoing<br/>Tender' && (
                            <Typography color="info.main" fontWeight={500}>
                              {auctionDurations[event.EventID] || ''}
                            </Typography>
                          )}
                          {event.STATUS === 'Ongoing<br/>Auction' && (
                            <Typography color="primary" fontWeight={500}>
                              {auctionDurations[event.EventID] || ''}
                            </Typography>
                          )}
                        </EventCardListItemTextBox>
                      }
                    />
                  </ListItem>
                </EventCardList>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
              <Grid item xs={12}>
                <EventCardList>
                  <ListItem alignItems="center">
                    <ListItemIcon>
                      <Clock size={18} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        isMediumUp ? (
                          <EventTimeBox justifyContent="start !important">
                            <Typography variant="body1">{formatDateAndTime(event.startDate)}</Typography>
                            <Typography variant="body2" fontWeight={600}>
                              To
                            </Typography>
                            <Typography variant="body1">{formatDateAndTime(event.EndDate)}</Typography>
                          </EventTimeBox>
                        ) : (
                          <EventTimeBox justifyContent={{ xs: 'space-around', sm: 'space-between !important' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                              <Typography>{formatDate(event.startDate)}</Typography>
                              <Typography>{formatTime(event.startDate)}</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={600}>
                              To
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                              <Typography>{formatDate(event.EndDate)}</Typography>
                              <Typography>{formatTime(event.EndDate)}</Typography>
                            </Box>
                          </EventTimeBox>
                        )
                      }
                    />
                  </ListItem>
                </EventCardList>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
      <DocumentActionMenu
        open={Boolean(anchorElMore)}
        anchorElMoreMenu={anchorElMore}
        moreMenuEventID={menuDetails?.EventID}
        moreMenuStartDate={menuDetails?.startDate}
        moreMenuEndDate={menuDetails?.endDate}
        eventCategories={menuDetails?.eventCategoryID}
        eventOutcomesUrl={menuDetails?.isAnalysis}
        moreMenuTenderEndDate={menuDetails?.TenderEndDate}
        moreMenuAuctionEndDate={menuDetails?.AuctionEndDate}
        moreMenuEnableAuctionLink={menuDetails?.EnbleAuctionLink}
        handleCloseMoreMenuButton={handleCloseMoreMenu}
      />
    </>
  );
};

export default EventCard;

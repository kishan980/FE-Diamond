'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Calendar } from 'iconsax-react';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Popper from '@mui/material/Popper';
import SimpleBar from 'simplebar-react';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { EventTimeBox, ListItemMainBox } from './Details.styled';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { UpcomingEvents } from 'services/homepage/type';
import { HomePageServices } from 'services/homepage/homepage.services';
import { UpcomingEventsButton } from 'views/common.styled';
import Avatar from 'components/@extended/Avatar';
import { formatDateAndTime } from 'utils/format-date';
import StatusChip from 'components/UIComponent/StatusChip';
import { EVENT_TYPE } from 'constants/event.constants';

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none',
};

const Details = () => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef<any>(null);

  const [events, setEvents] = useState<UpcomingEvents[]>([]);
  const [open, setOpen] = useState(false);

  const filteredEvents = useMemo(() => events.filter((event) => event.status === 'Ongoing<br/>Tender'), [events]);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await HomePageServices.getUpcomingEvents();
      if (typeof res !== 'string' && res.success) {
        setEvents(res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching upcoming events:', error);
      toast.error('An error occurred while fetching upcoming events');
    }
  }, []);

  const handleToggle = () => setOpen(!open);

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current?.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    fetchEvents();
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_GET_UPCOMING_EVENT_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchEvents();
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [fetchEvents]);

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <UpcomingEventsButton
          color="secondary"
          aria-label="announcement"
          ref={anchorRef}
          aria-controls={open ? 'profile-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          size="large"
          sx={{ bgcolor: open ? 'secondary.200' : 'secondary.100' }}
        >
          <Badge badgeContent={filteredEvents.length} color="success">
            <Calendar variant="Bold" />
          </Badge>
        </UpcomingEventsButton>
      </Box>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, borderRadius: 1.5, width: { xs: 320, sm: 420 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} content={false}>
                  <CardContent>
                    {filteredEvents.length > 0 ? (
                      <>
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h5">Ongoing Events</Typography>
                        </Stack>
                        <SimpleBar style={{ maxHeight: 'calc(100vh - 180px)' }}>
                          <List
                            component="nav"
                            sx={(theme) => ({
                              pb: 0,
                              '& .MuiListItemButton-root': {
                                p: 1,
                                my: 1,
                                border: `1px solid ${theme.palette.divider}`,
                                '&:hover': { bgcolor: 'primary.lighter', borderColor: 'primary.light' },
                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
                                '&:hover .MuiAvatar-root': { bgcolor: 'primary.main', color: 'background.paper' },
                              },
                            })}
                          >
                            {filteredEvents.map((event, index) => (
                              <>
                                <ListItem key={index}>
                                  <ListItemMainBox>
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar type="filled">
                                          <Calendar size={20} variant="Bold" />
                                        </Avatar>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                          <Typography variant="subtitle1">#{event.auTen_EvtId}</Typography>
                                          <Typography component="span" variant="h6">
                                            {event.co_name}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <StatusChip
                                        label={event.EventCategory}
                                        color={event.EventCategory === EVENT_TYPE.ROUGH ? 'success' : 'primary'}
                                      />
                                    </Box>
                                    <EventTimeBox>
                                      <Typography variant="body2">{formatDateAndTime(event.startDate)}</Typography>
                                      <Box component="img" src="/assets/icons/dot-black.png" />
                                      <Typography variant="body2">{formatDateAndTime(event.EndDate)}</Typography>
                                    </EventTimeBox>
                                  </ListItemMainBox>
                                </ListItem>
                                {filteredEvents.length - 1 !== index && <Divider flexItem />}
                              </>
                            ))}
                          </List>
                        </SimpleBar>
                      </>
                    ) : (
                      <Typography variant="h5" textAlign="center" fontWeight={500}>
                        No event found
                      </Typography>
                    )}
                  </CardContent>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default Details;

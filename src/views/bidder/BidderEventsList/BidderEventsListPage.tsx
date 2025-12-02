'use client';
import { useEffect, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import Backdrop from '@mui/material/Backdrop';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import { CloseCircle, ArrowRight2 } from 'iconsax-react';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { DialogTitleText, HeaderTitleMainBoxContainer } from './BidderEventsList.styled';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import { LoadingState } from 'types/table';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { formatDateAndTime, formatTimeRemaining } from 'utils/format-date';
import { renderTableCellEllipsis } from 'utils/renderTableCell';
import { GetViewParticipateData, ViewParticipateParams } from 'services/bidder/my-profile/type';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';

const BidderEventsListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const eventId = searchParams.get('eventId');
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { eventID, entityID, companyID } = imageDetails?.currentUserDetails ?? {};

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [viewParticipateData, setViewParticipateData] = useState<GetViewParticipateData[]>([]);
  const [remainingTimes, setRemainingTimes] = useState<{ [key: number]: string }>({});

  const fetchParticipateData = async () => {
    setLoading((prev) => ({ ...prev, isLoading: true }));
    try {
      const params: ViewParticipateParams = { entityId: Number(entityID), companyId: companyID };
      const res = await MyProfileServices.getOngoingTenders(params);

      if (typeof res !== 'string' && res.success) {
        if (res.data.length >= 2) {
          setViewParticipateData(res.data);
        } else if (res.data.length === 1) {
          setOpen(false);
          router.push(`/bidder/${res.data[0].EventID}`);
        } else {
          router.push(`/bidder/${eventID}`);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching participate data:', error);
      toast.error('Failed to fetch event list.');
    } finally {
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleEventSelect = async (eventId: number) => {
    setLoading((prev) => ({ ...prev, isLoading: true }));
    setOpen(false);
    router.push(`/bidder/${eventId}`);
  };

  useEffect(() => {
    fetchParticipateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const calculateRemainingTimes = () => {
      const now = new Date().getTime();
      const durations: { [key: number]: string } = {};

      viewParticipateData.forEach((event) => {
        const startTime = event.startDate ? parseISO(event.startDate).getTime() : null;
        const endTime = event.EndDate ? parseISO(event.EndDate).getTime() : null;

        if (!startTime || !endTime) {
          durations[event.EventID] = '';
          return;
        }

        const adjustedCurrentTime = now + 5.5 * 60 * 60 * 1000;
        let countdown = '';

        if (adjustedCurrentTime < startTime) {
          countdown = 'Not Open Yet';
        } else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime) {
          countdown = formatTimeRemaining(endTime - adjustedCurrentTime);
        } else {
          countdown = 'Closed';
        }
        durations[event.EventID] = countdown;
      });

      setRemainingTimes(durations);
    };

    if (viewParticipateData.length > 0) {
      calculateRemainingTimes();
      const interval = setInterval(calculateRemainingTimes, 1000);
      return () => clearInterval(interval);
    }
  }, [viewParticipateData]);

  return loading.isLoading ? (
    <Loader />
  ) : (
    <Dialog open={open} maxWidth="lg" fullWidth>
      <HeaderTitleMainBoxContainer>
        <DialogTitleText>Please select the event you wish to participate to:</DialogTitleText>
        {Number(eventId) && viewParticipateData.find((event) => event.EventID === Number(eventId)) ? (
          <Link href={`/bidder/${eventId}`}>
            <IconButton sx={{ left: { xs: '30%', sm: 0 } }}>
              <CloseCircle />
            </IconButton>
          </Link>
        ) : null}
      </HeaderTitleMainBoxContainer>
      <DialogContent>
        <MainCard title="Event" content={false}>
          <Backdrop sx={{ color: '#07bc0c', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading.isProgress}>
            <CircularProgress color="primary" />
          </Backdrop>
          <TableContainer sx={{ maxHeight: 430 }}>
            <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 3 }}>Company name</TableCell>
                  <TableCell>Helpdesk</TableCell>
                  <TableCell>Helpdesk</TableCell>
                  <TableCell>StartDate</TableCell>
                  <TableCell>EndDate</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viewParticipateData.length > 0 ? (
                  viewParticipateData.map((row, index) => {
                    if (!row) return null;
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow hover tabIndex={-1} key={row?.EventID}>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row?.EventDescription}
                        </TableCell>
                        {renderTableCellEllipsis({ content: row.EventLocation })}
                        {renderTableCellEllipsis({ content: row?.DefaultNumber?.replace(/#/g, ' / ') })}
                        {renderTableCellEllipsis({ content: formatDateAndTime(row?.startDate) })}
                        {renderTableCellEllipsis({ content: formatDateAndTime(row.EndDate) })}
                        {renderTableCellEllipsis({ content: remainingTimes[row.EventID] })}
                        <TableCell align="center" width="1%">
                          <IconButton onClick={() => handleEventSelect(row.EventID)}>
                            <ArrowRight2 color="#3f51b5" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <NoDataTableRow colSpan={7} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </DialogContent>
    </Dialog>
  );
};

export default BidderEventsListPage;

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { Clock } from 'iconsax-react';
import { useParams } from 'next/navigation';
import Profile from './Profile';
import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/DashboardLayout/Drawer/DrawerHeader';
import { MenuOrientation } from 'types/config';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { GetViewParticipateData, ViewParticipateParams } from 'services/bidder/my-profile/type';

const HeaderContent = () => {
  const { id: eventId } = useParams();
  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { entityID, companyID } = imageDetails?.currentUserDetails ?? {};

  const { menuOrientation } = useConfig();
  const [viewParticipateData, setViewParticipateData] = useState<GetViewParticipateData[]>([]);

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const fetchParticipateData = useCallback(async () => {
    const params: ViewParticipateParams = { entityId: Number(entityID), companyId: companyID };
    const res = await MyProfileServices.getOngoingTenders(params);

    if (typeof res !== 'string' && res.success) setViewParticipateData(res.data);
  }, [companyID, entityID]);

  useEffect(() => {
    fetchParticipateData();
  }, [fetchParticipateData]);

  return (
    <Box display="flex" alignItems="center" justifyContent={downLG ? 'end' : 'space-between'} width="100%">
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open />}
      <Box display="flex" alignItems="center">
        {viewParticipateData.length >= 2 && (
          <Link href={`/bidder?eventId=${eventId}`}>
            <Button variant="contained" sx={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }} startIcon={<Clock />}>
              Other On-Going Tenders
            </Button>
          </Link>
        )}
        <Profile />
      </Box>
    </Box>
  );
};

export default HeaderContent;

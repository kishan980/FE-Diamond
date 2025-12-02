import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Printer, Location, Global, Call, Buildings, Sms } from 'iconsax-react';
import { useEffect } from 'react';
import { FooterContainer, FooterMainContainer } from './Footer.styled';
import { useFooter } from 'contexts/FooterContext';

const Footer = () => {
  const { data, loading, refreshFooter } = useFooter();

  useEffect(() => {
    refreshFooter();
  }, [refreshFooter]);

  return (
    <FooterMainContainer>
      <Divider sx={{ my: 2 }} />
      <FooterContainer>
        <Stack spacing={1}>
          {loading ? (
            <>
              <Skeleton variant="text" width={160} height={24} />
              <Skeleton variant="text" width={220} height={24} />
            </>
          ) : (
            <>
              {data?.CompanyName && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Buildings size="18" variant="Outline" color="#1976d2" />
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {data?.CompanyName}
                  </Typography>
                </Stack>
              )}
              {data?.Address && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Location size="16" variant="Outline" />
                  <Typography variant="body2" color="text.secondary">
                    {data?.Address}
                  </Typography>
                </Stack>
              )}
            </>
          )}
        </Stack>
        <Stack spacing={1}>
          {loading ? (
            <>
              <Skeleton variant="text" width={160} height={24} />
              <Skeleton variant="text" width={160} height={24} />
              <Skeleton variant="text" width={160} height={24} />
            </>
          ) : (
            <>
              {data?.ContactNo1 && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Call size="16" variant="Outline" />
                  <Typography variant="body2">
                    <strong>Telephone 1:</strong> {data?.ContactNo1.replace('#', ' / ')}
                  </Typography>
                </Stack>
              )}
              {data?.ContactNo2 && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Call size="16" variant="Outline" />
                  <Typography variant="body2">
                    <strong>Telephone 2:</strong> {data?.ContactNo2.replace('#', ' / ')}
                  </Typography>
                </Stack>
              )}
              {data?.FaxNo1 && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Printer size="16" variant="Outline" />
                  <Typography variant="body2">
                    <strong>Fax:</strong> {data?.FaxNo1.replace('#', ' / ')}
                  </Typography>
                </Stack>
              )}
            </>
          )}
        </Stack>
        <Stack spacing={1}>
          {loading ? (
            <>
              <Skeleton variant="text" width={200} height={24} />
              <Skeleton variant="text" width={200} height={24} />
            </>
          ) : (
            <>
              {data?.EmailID1 && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Sms size="16" variant="Outline" />
                  <Typography variant="body2">
                    <strong>Email:</strong>{' '}
                    <Link href={`mailto:${data?.EmailID1}`} style={{ color: '#1976d2' }}>
                      {data?.EmailID1}
                    </Link>
                  </Typography>
                </Stack>
              )}
              {data?.CompanyName && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Global size="16" variant="Outline" />
                  <Typography variant="body2">
                    <strong>Website:</strong>{' '}
                    <Link
                      href={data?.WebURL?.startsWith('http') ? data.WebURL : `https://${data?.WebURL}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2' }}
                    >
                      {data?.WebURL}
                    </Link>
                  </Typography>
                </Stack>
              )}
            </>
          )}
        </Stack>
      </FooterContainer>
      <Divider sx={{ my: 2 }} />
      {loading ? (
        <Skeleton variant="text" width={250} height={20} sx={{ mx: 'auto', mb: 1.5 }} />
      ) : (
        <Typography variant="body2" align="center" color="textSecondary" pb={1.5}>
          © {new Date().getFullYear()} {data?.CompanyName}. All rights reserved.
        </Typography>
      )}
    </FooterMainContainer>
  );
};

export default Footer;

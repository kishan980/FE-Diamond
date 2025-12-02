import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Camera } from 'iconsax-react';
import { StackMainDivContainer, StyledStack, TextTypography } from './SingleVideo.styled';
import { DropzopType } from 'types/dropzone';

const UploadCover = '/assets/images/upload/upload.svg';

export default function PlaceholderContent({ fileType, type }: { fileType: string; type?: string }) {
  return (
    <>
      {type !== DropzopType.standard && (
        <StyledStack spacing={2}>
          <CardMedia component="img" image={UploadCover} sx={{ width: { xs: 80, sm: 150 } }} />
          <StackMainDivContainer spacing={1}>
            <Typography variant="h5">Drag & Drop or Select {fileType}</Typography>

            <TextTypography color="secondary">
              Drop {fileType} here or click&nbsp;
              <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                browse
              </Typography>
              &nbsp;thorough your machine
            </TextTypography>
          </StackMainDivContainer>
        </StyledStack>
      )}
      {type === DropzopType.standard && (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Camera style={{ fontSize: '32px' }} />
        </Stack>
      )}
    </>
  );
}

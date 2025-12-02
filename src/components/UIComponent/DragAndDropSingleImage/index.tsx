import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { ErrorCode, FileError, useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { MinusCirlce } from 'iconsax-react';
import PlaceholderContent from './PlaceholderContent';
import { DropzoneWrapper, StyledCardMedia } from './SingleImage.styled';
import RejectionFiles from 'components/third-party/dropzone/RejectionFiles';
import { CustomFile } from 'types/dropzone';
import { DragAndDropSingleFileProps } from 'types/dragAndDrop';

const DragAndDropSingleImage = ({ error, file, sx, setFieldValue, name, formik }: DragAndDropSingleFileProps) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    validator: (file: File) => {
      if (!file.type.includes('image/')) {
        return { message: 'Enter a valid image file.', code: ErrorCode.FileInvalidType } as FileError;
      }
      return null;
    },
    noKeyboard: true,
    onDrop: async (acceptedFiles: CustomFile[]) => {
      if (!acceptedFiles.length) return;

      const [file] = acceptedFiles;
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = objectUrl;

      image.onload = () => {
        const { width, height } = image;

        if (width > 400 || height > 100) {
          setFieldValue(name, null);
          setLocalError('Image size must not exceed 400px width and 100px height');
          formik.setFieldError(name, 'Image size must not exceed 400px width and 100px height');
          formik.setTouched({ [name]: true });
        } else {
          setLocalError(null);
          file.preview = objectUrl;
          setFieldValue(name, [file]);
        }
      };
    },
  });

  const onRemove = () => {
    setFieldValue(name, null);
  };

  const renderThumbs = () => {
    if (!file) return null;

    if (typeof file === 'string') {
      return (
        <StyledCardMedia
          component="img"
          src={file}
          sx={{
            position: 'absolute',
            height: 100,
          }}
        />
      );
    }

    if (Array.isArray(file)) {
      return file.map((item) => (
        <StyledCardMedia
          key={item.name}
          component="img"
          src={item.preview}
          sx={{
            position: 'absolute',
            height: 100,
          }}
        />
      ));
    }

    return null;
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
        }}
      >
        <input {...getInputProps()} />
        {!file && <PlaceholderContent fileType="image" />}
        {renderThumbs()}
      </DropzoneWrapper>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {(localError || (formik.touched[name] && formik.errors[name])) && (
        <Box sx={{ color: 'error.main', mt: 1, fontSize: 13 }}>
          {localError || (typeof formik.errors[name] === 'string' ? formik.errors[name] : '')}
        </Box>
      )}

      {file && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button variant="contained" color="error" onClick={onRemove} startIcon={<MinusCirlce />}>
            Remove
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default DragAndDropSingleImage;

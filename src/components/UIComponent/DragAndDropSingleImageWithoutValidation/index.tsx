import Box from '@mui/material/Box';
import { ErrorCode, FileError, useDropzone } from 'react-dropzone';
import { useState } from 'react';
import DeleteIconButton from '../IconButtons/DeleteButton';
import PlaceholderContent from './PlaceholderContent';
import { DeleteIconButtonMainBox, DropzoneWrapper, StyledCardMedia } from './SingleImage.styled';
import RejectionFiles from 'components/third-party/dropzone/RejectionFiles';
import { CustomFile } from 'types/dropzone';
import { DragAndDropSingleFileProps } from 'types/dragAndDrop';

const DragAndDropSingleImageWithoutValidation = ({ error, file, sx, setFieldValue, name, formik }: DragAndDropSingleFileProps) => {
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
        setLocalError(null);
        file.preview = objectUrl;
        setFieldValue(name, [file]);
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
            height: 160,
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
            height: 160,
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
        <DeleteIconButtonMainBox onClick={(e) => e.stopPropagation()}>
          {file && <DeleteIconButton title="Delete" onClick={onRemove} />}
        </DeleteIconButtonMainBox>
        {renderThumbs()}
      </DropzoneWrapper>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {(localError || (formik.touched[name] && formik.errors[name])) && (
        <Box sx={{ color: 'error.main', mt: 1, fontSize: 13 }}>
          {localError || (typeof formik.errors[name] === 'string' ? formik.errors[name] : '')}
        </Box>
      )}
    </Box>
  );
};

export default DragAndDropSingleImageWithoutValidation;

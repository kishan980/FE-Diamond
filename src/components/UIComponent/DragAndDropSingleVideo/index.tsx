import Box from '@mui/material/Box';
import { ErrorCode, FileError, useDropzone } from 'react-dropzone';
import { useState } from 'react';
import DeleteIconButton from '../IconButtons/DeleteButton';
import PlaceholderContent from './PlaceholderContent';
import { DeleteIconButtonMainBox, DropzoneWrapper, StyledVideo, VideoMainBox } from './SingleVideo.styled';
import RejectionFiles from 'components/third-party/dropzone/RejectionFiles';
import { CustomFile } from 'types/dropzone';
import { DragAndDropSingleFileProps } from 'types/dragAndDrop';

const DragAndDropSingleVideo = ({ error, file, sx, setFieldValue, name, formik }: DragAndDropSingleFileProps) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: { 'video/*': [] },
    multiple: false,

    validator: (file: File) => {
      if (!file.type.includes('video/')) {
        return { message: 'Enter a valid video file.', code: ErrorCode.FileInvalidType } as FileError;
      }
      return null;
    },
    noKeyboard: true,
    onDrop: async (acceptedFiles: CustomFile[]) => {
      if (!acceptedFiles.length) return;

      const [file] = acceptedFiles;
      const objectUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = objectUrl;

      video.onloadedmetadata = () => {
        const { duration } = video;

        if (duration > 60) {
          setFieldValue(name, null);
          setLocalError('Video duration must not exceed 60 seconds');
          formik.setFieldError(name, 'Video duration must not exceed 60 seconds');
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

  const renderPreview = () => {
    if (!file) return null;

    if (typeof file === 'string') {
      return (
        <VideoMainBox>
          <StyledVideo src={file} controls />
        </VideoMainBox>
      );
    }

    if (Array.isArray(file)) {
      return file.map((item) => (
        <VideoMainBox key={item.name}>
          <StyledVideo src={item.preview} controls />
        </VideoMainBox>
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
        {!file && <PlaceholderContent fileType="video" />}
        <DeleteIconButtonMainBox onClick={(e) => e.stopPropagation()}>
          {file && <DeleteIconButton title="Delete" onClick={onRemove} />}
        </DeleteIconButtonMainBox>
        {renderPreview()}
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

export default DragAndDropSingleVideo;

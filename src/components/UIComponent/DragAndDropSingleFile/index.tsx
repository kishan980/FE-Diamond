import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DocumentText, DocumentUpload, MinusCirlce } from 'iconsax-react';
import { ErrorCode, FileError, useDropzone } from 'react-dropzone';
import PlaceholderContent from './PlaceholderContent';
import { DropzoneWrapper } from './DragAndDropSingleFile.styled';
import RejectionFiles from 'components/third-party/dropzone/RejectionFiles';
import { CustomFile } from 'types/dropzone';
import { DragAndDropFilePropsType } from 'types/dragAndDrop';

const DragAndDropSingleFile = ({ error, file, sx, setFieldValue, name, onUploadClick }: DragAndDropFilePropsType) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
    multiple: false,
    validator: (file: File) => {
      const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedMimeTypes.includes(file.type)) {
        return { message: 'Only PDF, Excel,  or Word files are allowed.', code: ErrorCode.FileInvalidType } as FileError;
      }
      return null;
    },
    onDrop: (acceptedFiles: CustomFile[]) => {
      setFieldValue(
        name,
        acceptedFiles.map((file: CustomFile) => Object.assign(file, { preview: URL.createObjectURL(file) }))
      );
    },
  });

  const onRemove = () => {
    setFieldValue(name, null);
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
        {file ? (
          <Box display="flex" alignItems="center" gap={1}>
            <DocumentText />
            <Typography>{typeof file === 'string' ? file : file[0]?.name}</Typography>
          </Box>
        ) : (
          <PlaceholderContent fileType="PDF, Excel, or Word file" />
        )}
      </DropzoneWrapper>
      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      {file && file.length > 0 && (
        <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1.5 }}>
          <Button variant="contained" color="primary" onClick={onUploadClick} startIcon={<DocumentUpload />}>
            Upload
          </Button>
          <Button variant="contained" color="error" onClick={onRemove} startIcon={<MinusCirlce />}>
            Remove
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default DragAndDropSingleFile;

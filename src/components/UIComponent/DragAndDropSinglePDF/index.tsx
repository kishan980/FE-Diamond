import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DocumentText, MinusCirlce } from 'iconsax-react';
import { ErrorCode, FileError, useDropzone } from 'react-dropzone';
import PlaceholderContent from './PlaceholderContent';
import { DropzoneWrapper } from './DragAndDropSinglePDF.styled';
import RejectionFiles from 'components/third-party/dropzone/RejectionFiles';
import { CustomFile } from 'types/dropzone';
import { DragAndDropSinglePDFProps } from 'types/dragAndDrop';

const DragAndDropSinglePDF = ({ error, file, sx, setFieldValue, name }: DragAndDropSinglePDFProps) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: { 'application/pdf': [] },
    multiple: false,
    validator: (file: File) => {
      if (!file.type.includes('application/pdf')) {
        return { message: 'Enter valide PDF file.', code: ErrorCode.FileInvalidType } as FileError;
      }
      return null;
    },
    onDrop: (acceptedFiles: CustomFile[]) => {
      setFieldValue(
        name,
        acceptedFiles.map((file: CustomFile) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
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
            <Typography>{typeof file === 'string' ? file : file[0].name}</Typography>
          </Box>
        ) : (
          <PlaceholderContent fileType="PDF file" />
        )}
      </DropzoneWrapper>
      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      {file && file.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button variant="contained" color="error" onClick={onRemove} startIcon={<MinusCirlce />}>
            Remove
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default DragAndDropSinglePDF;

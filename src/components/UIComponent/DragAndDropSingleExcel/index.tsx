import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { ErrorCode, FileError, useDropzone } from 'react-dropzone';
import { DocumentText, DocumentUpload, MinusCirlce } from 'iconsax-react';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import PlaceholderContent from './PlaceholderContent';
import { DropzoneWrapper } from './DragAndDropSingleExcel.styled';
import RejectionFiles from 'components/third-party/dropzone/RejectionFiles';
import { CustomFile } from 'types/dropzone';
import { DragAndDropExcelPropsType } from 'types/dragAndDrop';

const DragAndDropSingleExcel = ({ error, file, sx, setFieldValue, name, onUploadClick, isLoading }: DragAndDropExcelPropsType) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: {
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    },
    multiple: false,
    validator: (file: File) => {
      const allowedExtensions = ['.xls', '.xlsx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        return { message: 'Enter valid Excel file.', code: ErrorCode.FileInvalidType } as FileError;
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
            color: 'primary.main',
            borderColor: 'primary.light',
            bgcolor: 'primary.lighter',
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
          <PlaceholderContent fileType=".xls or .xlsx file" />
        )}
      </DropzoneWrapper>
      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      {file && file.length > 0 && (
        <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1.5 }}>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            color="primary"
            onClick={onUploadClick}
            startIcon={<DocumentUpload color="#d9e3f0" />}
          >
            Upload
          </LoadingButton>
          <Button variant="outlined" color="error" onClick={onRemove} disabled={isLoading} startIcon={<MinusCirlce />}>
            Remove
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default DragAndDropSingleExcel;

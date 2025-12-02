import { ChangeEvent, FC, useState } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { DocumentUpload } from 'iconsax-react';

interface InputFileUploadProps {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const UploadButton: FC<InputFileUploadProps> = ({ onChange }) => {
  const [fileName, setFileName] = useState('');

  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
  ];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !allowedTypes.includes(file.type)) {
      return toast.error('Invalid file type. Please upload a file of type xls, xlsx, doc, docx, or pdf.');
    }
    if (file) {
      setFileName(file.name);
    }
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <Button component="label" role={undefined} variant="contained">
        <DocumentUpload />
        <Input type="file" sx={{ display: 'none' }} onChange={handleFileChange} />
      </Button>
      {fileName && <Typography style={{ marginLeft: '10px' }}>{fileName}</Typography>}
    </Box>
  );
};

'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MainBoxContainer } from './RoughBidder.styled';
import DragAndDropSingleFile from 'components/UIComponent/DragAndDropSingleFile';
import { RoughBiddersServices } from 'services/account/roughBidders/roughBidders.services';
import { CustomFile } from 'types/dropzone';
import { DialogProps } from 'types/dialog';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';

const UploadRoughBiddersDialog = ({ open, handleClose }: DialogProps) => {
  const [selectedFile, setSelectedFile] = useState<CustomFile[] | string>('');
  const [error, setError] = useState<string | null>(null);
  const [response, setResponce] = useState<any>('');

  const handleFileDrop = (name: string, value: any) => {
    setSelectedFile(value);

    if (value && value.length > 0) {
      const fileType = value[0].type;
      const allowedMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedMimeTypes.includes(fileType)) {
        setError('Only Excel files are allowed.');
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (typeof selectedFile !== 'string') {
      try {
        const [file] = selectedFile;
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const csvData = (reader.result as string).trim();
            const rows = csvData.split('\n');
            const headers = rows[0].split(',');
            const jsonData = [];
            for (let i = 1; i < rows.length; i++) {
              const rowData = rows[i].split(',');
              const entry: { [key: string]: string } = {};
              for (let j = 0; j < headers.length; j++) {
                entry[headers[j]] = rowData[j];
              }
              jsonData.push(entry);
            }
            const data = JSON.stringify(jsonData);
            setResponce(data);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error parsing Excel data UploadFile:', error);
            toast.error('Failed to parse the Excel data');
          }
        };
        reader.readAsText(file);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to read the file UploadFile :', error);
        toast.error('Failed to read the file');
      }
    }
  };

  const handelImport = async (data: string) => {
    try {
      const res = await RoughBiddersServices.importRoughBidders(data);
      if (typeof res !== 'string' && res.success) toast.success('File uploaded successfully');
      handleClose();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('File upload failed handelImport :', error);
      toast.error('File upload failed');
    }
  };

  useEffect(() => {
    if (response) handelImport(response);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleDialogClose = () => {
    setSelectedFile('');
    handleClose();
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleDialogClose}
      title="Add File"
      fullWidth
      content={
        <MainBoxContainer>
          <DragAndDropSingleFile
            name="ImportRoughBidders"
            setFieldValue={handleFileDrop}
            file={selectedFile}
            error={error}
            onUploadClick={handleUpload}
          />
        </MainBoxContainer>
      }
    />
  );
};

export default UploadRoughBiddersDialog;

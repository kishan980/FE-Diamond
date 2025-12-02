'use client';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { DocumentDownload } from 'iconsax-react';
import Button from '@mui/material/Button';
import { exportUploadLotsToCSVLink } from '../ExportLinkDataHeaderUtils';
import { UploadXLSFileMainContainer, UploadXLSFileButton } from './UploadXLSFile.styled';
import { AddUploadLotsParams } from 'services/event/event-action/upload-lots/type';
import { UploadLotsServices } from 'services/event/event-action/upload-lots/uploadLots.services';
import { CustomFile } from 'types/dropzone';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import DragAndDropSingleExcel from 'components/UIComponent/DragAndDropSingleExcel';
import { UploadXLSFileDialogProps } from 'types/dialog';

const UploadLotsXlxsFile = ({
  open,
  handleClose,
  eventCatagoryId,
  selectedSellerID,
  selectedMineID,
  setLoading,
  isLoading,
  handleGetUploadLotsById,
}: UploadXLSFileDialogProps) => {
  const { id } = useParams();
  const eventId = Number(id);
  const [selectedFile, setSelectedFile] = useState<CustomFile[] | string>('');
  const [error, setError] = useState<string | null>(null);

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

  const handelImport = async (file: File) => {
    setLoading((prev) => ({ ...prev, isProgress: true }));

    try {
      const params: AddUploadLotsParams = {
        file,
        sellerId: Number(selectedSellerID),
        mineId: Number(selectedMineID),
        eventId,
        type: eventCatagoryId === 1 ? 'Rough' : 'Polished',
      };

      const res = await UploadLotsServices.importUploadLots(params);

      if (typeof res !== 'string' && res.success) {
        toast.success('File uploaded successfully');
        await handleGetUploadLotsById(eventId, true);
        handleClose();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('File upload failed handelImport :', error);
      toast.error('File upload failed ');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
      setSelectedFile('');
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (typeof selectedFile !== 'string') {
      const [file] = selectedFile;

      const [fileName] = file.name.split('.');

      if (fileName !== 'RoughLots') {
        toast.error('Upload Lots file name should be RoughLots');
        return;
      }

      await handelImport(file);
    }
  };

  const handleExportClick = () => {
    try {
      const csv = exportUploadLotsToCSVLink(eventCatagoryId);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FileDemo.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('File demo successfully!');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error occurred during export handleExportClick:', error);
      toast.error('Error occurred during export.');
    }
  };

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
        <UploadXLSFileMainContainer>
          <UploadXLSFileButton>
            <Button variant="contained" onClick={handleExportClick} startIcon={<DocumentDownload />}>
              Download Format
            </Button>
          </UploadXLSFileButton>
          <DragAndDropSingleExcel
            name="ImportUploadLots"
            setFieldValue={handleFileDrop}
            file={selectedFile}
            error={error}
            onUploadClick={handleUpload}
            isLoading={isLoading}
          />
        </UploadXLSFileMainContainer>
      }
    />
  );
};

export default UploadLotsXlxsFile;

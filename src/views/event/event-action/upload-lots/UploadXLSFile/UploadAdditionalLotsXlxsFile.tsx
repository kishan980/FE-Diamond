'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import Button from '@mui/material/Button';
import { DocumentDownload } from 'iconsax-react';
import { UploadXLSFileButton, UploadXLSFileMainContainer } from './UploadXLSFile.styled';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import DragAndDropSingleExcel from 'components/UIComponent/DragAndDropSingleExcel';
import { exportUploadLotsToCSVLink } from 'views/event/event-action/upload-lots/ExportLinkDataHeaderUtils';
import { CustomFile } from 'types/dropzone';
import { UploadLotsServices } from 'services/event/event-action/upload-lots/uploadLots.services';
import { UploadAdditionalXlxsFileDialogProps } from 'types/dialog';
import { AddUploadAdditionalLotsParams } from 'services/event/event-action/upload-lots/type';

const UploadAdditionalLotsXlxsFile = ({
  open,
  handleClose,
  eventCatagoryId,
  selectedSellerID,
  selectedMineID,
  setLoading,
  isLoading,
  handleGetUploadLotsById,
}: UploadAdditionalXlxsFileDialogProps) => {
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
      const params: AddUploadAdditionalLotsParams = {
        file,
        sellerId: Number(selectedSellerID),
        mineId: Number(selectedMineID),
        eventId,
        type: eventCatagoryId === 1 ? 'Rough' : 'Polished',
      };

      const res = await UploadLotsServices.addUploadAdditionalLots(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('File uploaded successfully');
        handleGetUploadLotsById(eventId);
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

export default UploadAdditionalLotsXlxsFile;

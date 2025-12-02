'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import { useParams } from 'next/navigation';
import { DocumentDownload } from 'iconsax-react';
import { UploadTitleTypography } from '../UploadLots.styled';
import {
  UploadStockDetailField,
  UploadStockDetailInnerContainer,
  UploadStockDetailMainContainer,
  UploadStockDetailTitleTypography,
} from './UploadStockDetailModel.styled';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import { CustomFile } from 'types/dropzone';
import { UploadStockDetailsDialogProps } from 'types/dialog';
import { UploadLotsServices } from 'services/event/event-action/upload-lots/uploadLots.services';
import DragAndDropSingleExcel from 'components/UIComponent/DragAndDropSingleExcel';
import { AddUploadStockDetailsParams } from 'services/event/event-action/upload-lots/type';
import { handleExcelExport } from 'utils/exportUtils';

function UploadStockDetailModel({ open, handleClose, moreMenuLotNo, loading, setLoading }: UploadStockDetailsDialogProps) {
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
        setError('Only XLSX files are allowed.');
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
      const params: AddUploadStockDetailsParams = {
        eventId,
        seqNo: Number(moreMenuLotNo),
        file,
      };

      const res = await UploadLotsServices.importUploadStockDetails(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('File uploaded successfully');
        handleClose();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('File upload failed handelImport :', error);
      toast.error('File upload failed ');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: true }));
      setSelectedFile('');
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (typeof selectedFile !== 'string') {
      const [file] = selectedFile;

      const [fileName] = file.name.split('.');

      if (fileName !== 'StoneDetail') {
        toast.error('Upload Lots file name should be StoneDetail');
        return;
      }
      await handelImport(file);
    }
  };

  const handleExportExcel = () => handleExcelExport(() => UploadLotsServices.exportExcel(), setLoading, 'isConfirmLoading');

  return (
    <>
      {loading.isConfirmLoading && <CircularLoader isProgress={loading.isConfirmLoading} />}
      <CustomDialog
        open={open}
        onClose={handleClose}
        title="Upload Stock Detail"
        fullWidth
        content={
          <UploadStockDetailMainContainer>
            <UploadStockDetailTitleTypography>Lot No: 1</UploadStockDetailTitleTypography>
            <UploadStockDetailInnerContainer>
              <UploadStockDetailField>
                <UploadTitleTypography>Excel Format:</UploadTitleTypography>
                <Button onClick={handleExportExcel} startIcon={<DocumentDownload />}>
                  Click here to Download Upload Stock Stone Detail Excel Fromat
                </Button>
              </UploadStockDetailField>
              <UploadStockDetailField>
                <UploadStockDetailTitleTypography>Upload Stock:</UploadStockDetailTitleTypography>
                <DragAndDropSingleExcel
                  name="ImportUploadLots"
                  setFieldValue={handleFileDrop}
                  file={selectedFile}
                  error={error}
                  onUploadClick={handleUpload}
                  isLoading={loading.isProgress}
                />
              </UploadStockDetailField>
            </UploadStockDetailInnerContainer>
          </UploadStockDetailMainContainer>
        }
      />
    </>
  );
}

export default UploadStockDetailModel;

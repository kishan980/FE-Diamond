'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import DragAndDropSingleFile from 'components/UIComponent/DragAndDropSingleFile';
import { CustomFile } from 'types/dropzone';
import { PolishedBidderModalProps } from 'types/dialog';
import { RoughBiddersServices } from 'services/account/roughBidders/roughBidders.services';
import { PolishedBiddersServices } from 'services/account/polishedBidders/polishedBidders.services';
import { MainBoxContainer } from 'views/account/RoughBidders/RoughBidder.styled';

function PolishedBidderDocumentModel({
  open,
  handleClose,
  docName,
  selectedDocPath,
  entityID,
  refSeqNo,
  selectedSeqNo,
  fetchData,
}: PolishedBidderModalProps) {
  const [isProgress, setIsProgress] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CustomFile[] | string>('');

  const handleFileDrop = (value: string | CustomFile[]) => setSelectedFile(value);

  const handleUpload = async () => {
    setIsProgress(true);

    if (typeof selectedFile !== 'string') {
      const params = {
        file: selectedFile[0],
        oldFile: selectedDocPath,
        docId: Number(selectedSeqNo),
      };
      const uploadKit = await PolishedBiddersServices.uploadImage(params);
      if (typeof uploadKit !== 'string') {
        try {
          const params = {
            id: entityID,
            docId: Number(selectedSeqNo),
            document: uploadKit.url,
            docname: docName,
            refSeqNo_Doc: Number(refSeqNo),
          };

          const res = await RoughBiddersServices.updateUploadDocs(params);
          if (typeof res !== 'string' && res.success) {
            toast.success('File uploaded successfully');
            fetchData();
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to upload file', error);
          toast.error('Failed to upload file');
        }
      }

      setSelectedFile('');
      setIsProgress(false);
      handleClose();
    }
  };

  const handleDialogClose = () => {
    setSelectedFile('');
    handleClose();
  };

  return (
    <>
      {isProgress && <CircularLoader isProgress={isProgress} />}
      <CustomDialog
        open={open}
        onClose={handleDialogClose}
        title="Add File"
        fullWidth
        content={
          <MainBoxContainer>
            <DragAndDropSingleFile
              name="termsConditionDoc"
              setFieldValue={handleFileDrop}
              file={selectedFile}
              onUploadClick={handleUpload}
              error={false}
            />
          </MainBoxContainer>
        }
      />
    </>
  );
}

export default PolishedBidderDocumentModel;

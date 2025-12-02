'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MainBoxContainer } from './RoughBidder.styled';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import DragAndDropSingleFile from 'components/UIComponent/DragAndDropSingleFile';
import { CustomFile } from 'types/dropzone';
import { RoughBidderModalProps } from 'types/dialog';
import { RoughBiddersServices } from 'services/account/roughBidders/roughBidders.services';

function RoughBidderDocumentModel({
  open,
  handleClose,
  docName,
  selectedDocPath,
  entityID,
  refSeqNo,
  selectedSeqNo,
  fetchData,
}: RoughBidderModalProps) {
  const [isProgress, setIsProgress] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CustomFile[] | string>('');
  const [uploadError, setUploadError] = useState('');

  const handleFileDrop = (name: string, value: any) => {
    setUploadError('');
    if (value && value.length > 0) {
      const [file] = value;
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setUploadError('Only .pdf, .doc, and .docx files are allowed');
        setSelectedFile('');
        return;
      }

      setSelectedFile(value);
    }
  };

  const handleUpload = async () => {
    setIsProgress(true);

    if (typeof selectedFile !== 'string') {
      const params = {
        file: selectedFile[0],
        oldFile: selectedDocPath,
        docId: Number(selectedSeqNo),
      };
      const uploadKit = await RoughBiddersServices.uploadImage(params);
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
              error={uploadError}
            />
            {uploadError && <div style={{ color: '#F04134', marginTop: '0.5rem' }}>{uploadError}</div>}
          </MainBoxContainer>
        }
      />
    </>
  );
}

export default RoughBidderDocumentModel;

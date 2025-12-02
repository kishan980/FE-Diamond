import React from 'react';
import { PreviewImageAndVideoBox, PreviewImageContainer } from './ImageAndVideoPreviewModal.styled';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import { FetchLotsImage } from 'services/event/event-action/upload-lots/type';
import { ImageAndVideoPreviewModalProps } from 'types/bidder';

const ImageAndVideoPreviewModal = ({ selectedMedia, previewOpen, handlePreviewClose }: ImageAndVideoPreviewModalProps<FetchLotsImage>) => {
  return (
    selectedMedia && (
      <CustomDialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="md"
        content={
          <PreviewImageAndVideoBox>
            {selectedMedia?.fileType === 'image' && (
              <PreviewImageContainer src={selectedMedia?.url || ''} alt="preview" width={500} height={500} />
            )}
            {selectedMedia?.fileType === 'non-image' && (
              <video
                controls
                autoPlay
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  maxHeight: 500,
                  height: '100%',
                  width: '100%',
                }}
              >
                <source src={selectedMedia?.url || ''} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </PreviewImageAndVideoBox>
        }
      />
    )
  );
};

export default ImageAndVideoPreviewModal;

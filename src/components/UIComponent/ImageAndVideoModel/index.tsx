'use client';
import { SyntheticEvent, useEffect, useState } from 'react';
import ImageAndVideoModalTabs from './ImageAndVideoModalTabs';
import { ImageAndVideoContent, ImageAndVideoMainContainer } from './ImageAndVideoModel.styled';
import SelectedLotDetialCard from './SelectedLotDetialCard';
import ImageAndVideoMediaGridContainer from './ImageAndVideoMediaGridContainer';
import ImageAndVideoPreviewModal from './ImageAndVideoPreviewModal';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import { FetchLotsImage } from 'services/event/event-action/upload-lots/type';
import { ImageAndVideoDialogProps } from 'types/dialog';

const ImageAndVideoModel = ({ open, handleClose, uploadedImages, selectedLot }: ImageAndVideoDialogProps<FetchLotsImage[]>) => {
  const [tab, setTab] = useState('photos');
  const [images, setImages] = useState<FetchLotsImage[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<FetchLotsImage | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleMediaClick = (media: FetchLotsImage) => {
    setSelectedMedia(media);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setSelectedMedia(null);
  };

  const handleCloseModal = () => {
    handleClose();
    setTab('photos');
  };

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => setTab(newValue);

  useEffect(() => {
    setImages(uploadedImages);
  }, [uploadedImages]);

  return (
    <>
      <CustomDialog
        open={open}
        onClose={handleCloseModal}
        fullWidth
        content={
          <ImageAndVideoMainContainer sx={{ px: { xs: 2, sm: 0 } }}>
            <ImageAndVideoModalTabs tab={tab} handleTabChange={handleTabChange} />
            <ImageAndVideoContent>
              <SelectedLotDetialCard selectedLot={selectedLot} />
              <ImageAndVideoMediaGridContainer tab={tab} handleMediaClick={handleMediaClick} images={images} />
            </ImageAndVideoContent>
          </ImageAndVideoMainContainer>
        }
      />
      <ImageAndVideoPreviewModal selectedMedia={selectedMedia} previewOpen={previewOpen} handlePreviewClose={handlePreviewClose} />
    </>
  );
};

export default ImageAndVideoModel;

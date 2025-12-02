'use client';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DocumentUpload } from 'iconsax-react';
import { useFormik } from 'formik';
import { UploadPhotosMainContainer, UploadPhotosFieldBox, UploadPhotosField, UploadTitleTypography } from './UploadLots.styled';
import { TextTitle } from './UploadImageAndVideo.styled';
import ImageAndVideoModalTabs from 'components/UIComponent/ImageAndVideoModel/ImageAndVideoModalTabs';
import ImageAndVideoPreviewModal from 'components/UIComponent/ImageAndVideoModel/ImageAndVideoPreviewModal';
import ImageAndVideoMediaGridContainer from 'components/UIComponent/ImageAndVideoModel/ImageAndVideoMediaGridContainer';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import { UploadLotsServices } from 'services/event/event-action/upload-lots/uploadLots.services';
import { FetchLotsImage, UploadImagesParams } from 'services/event/event-action/upload-lots/type';
import { UploadImageAndVideoDialogProps } from 'types/dialog';
import DragAndDropSingleVideo from 'components/UIComponent/DragAndDropSingleVideo';
import DragAndDropSingleImageWithoutValidation from 'components/UIComponent/DragAndDropSingleImageWithoutValidation';

type UploadMediaFormValues = {
  mainImage: File[] | null;
  subImage: File[] | null;
  highResVideo: File[] | null;
  lowResVideo: File[] | null;
};

const UploadImageAndVideoDialog = ({
  open,
  handleClose,
  moreMenuLotNo,
  uploadedImages,
  handleGetUploadLotsById,
}: UploadImageAndVideoDialogProps<FetchLotsImage[]>) => {
  const { id } = useParams();
  const eventId = Number(id);
  const [tab, setTab] = useState('photos');
  const [isProgress, setIsProgress] = useState(false);
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

  const initialValues: UploadMediaFormValues = {
    mainImage: null,
    subImage: null,
    highResVideo: null,
    lowResVideo: null,
  };

  const { values, errors, touched, handleSubmit, setFieldValue, setFieldError, setTouched, resetForm } = useFormik<UploadMediaFormValues>({
    initialValues,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => setTab(newValue);

  const handleSubmitForm = async (values: UploadMediaFormValues) => {
    setIsProgress(true);
    const uploadResults: FetchLotsImage[] = [];

    const uploadFile = async (file: File[] | null, type: UploadImagesParams['uploadType']) => {
      if (file) {
        const params: UploadImagesParams = {
          file,
          eventId,
          lotNo: moreMenuLotNo,
          uploadType: type,
        };
        const response = await UploadLotsServices.uploadImage(params);
        if (typeof response !== 'string' && response.success) {
          toast.success(`${type} uploaded successfully.`);
          handleGetUploadLotsById(eventId, false);
          return {
            fileId: response.data?.fileId,
            url: response.data?.url,
            fileType: response.data?.fileType,
            thumbnail: response.data?.thumbnailUrl,
          };
        }
      }
      return null;
    };

    const mainImageResult = await uploadFile(values.mainImage, 'main');
    const subImageResult = await uploadFile(values.subImage, 'sub');
    const highResVideoResult = await uploadFile(values.highResVideo, 'highRes');
    const lowResVideoResult = await uploadFile(values.lowResVideo, 'lowRes');

    setFieldValue('mainImage', null);
    setFieldValue('subImage', null);
    setFieldValue('highResVideo', null);
    setFieldValue('lowResVideo', null);

    if (mainImageResult || subImageResult || highResVideoResult || lowResVideoResult || uploadResults.length > 0) {
      setImages((prevImages) => {
        let updatedImages = [...prevImages];

        if (mainImageResult) {
          updatedImages = updatedImages.filter((image) => !image.url.includes('/main_'));
          updatedImages.push({
            fileId: mainImageResult.fileId,
            url: mainImageResult.url,
            fileType: mainImageResult.fileType,
            thumbnail: mainImageResult.thumbnail,
          });
        }

        if (subImageResult) {
          updatedImages.push({
            fileId: subImageResult.fileId,
            url: subImageResult.url,
            fileType: subImageResult.fileType,
            thumbnail: subImageResult.thumbnail,
          });
        }

        if (highResVideoResult) {
          updatedImages.push({
            fileId: highResVideoResult.fileId,
            url: highResVideoResult.url,
            fileType: highResVideoResult.fileType,
            thumbnail: highResVideoResult.thumbnail,
          });
        }

        if (lowResVideoResult) {
          updatedImages.push({
            fileId: lowResVideoResult.fileId,
            url: lowResVideoResult.url,
            fileType: lowResVideoResult.fileType,
            thumbnail: lowResVideoResult.thumbnail,
          });
        }

        uploadResults.forEach((result) => {
          if (!updatedImages.some((img) => img.fileId === result.fileId)) {
            updatedImages.push(result);
          }
        });

        return updatedImages;
      });
    }

    setIsProgress(false);
  };

  const handleDeleteImage = async (fileId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsProgress(true);
    const response = await UploadLotsServices.deleteImage(fileId);

    if (typeof response !== 'string' && response.success) {
      setImages((prevImages) => prevImages.filter((img) => img.fileId !== fileId));
      toast.success('Image deleted successfully.');
    } else {
      toast.error('Failed to delete image.');
    }
    setIsProgress(false);
  };

  useEffect(() => {
    setImages(uploadedImages);
  }, [uploadedImages]);

  const handleDialogClose = () => {
    resetForm();
    setImages([]);
    setSelectedMedia(null);
    setPreviewOpen(false);
    setTab('photos');
    handleClose();
  };

  return (
    <>
      {isProgress && <CircularLoader isProgress={isProgress} />}
      <CustomDialog
        open={open}
        onClose={handleDialogClose}
        title={<TextTitle>Upload Lot Image/Video (Lot No: {moreMenuLotNo})</TextTitle>}
        fullWidth
        content={
          <form onSubmit={handleSubmit}>
            <UploadPhotosMainContainer sx={{ borderTop: 1, borderColor: 'divider' }}>
              <ImageAndVideoModalTabs tab={tab} handleTabChange={handleTabChange} />
              <UploadPhotosMainContainer>
                {tab === 'photos' ? (
                  <UploadPhotosFieldBox>
                    <UploadPhotosField>
                      <UploadTitleTypography>Main Image:</UploadTitleTypography>
                      <DragAndDropSingleImageWithoutValidation
                        name="mainImage"
                        file={values.mainImage}
                        setFieldValue={setFieldValue}
                        error={touched.mainImage && Boolean(errors.mainImage)}
                        formik={{ setFieldValue, setFieldError, setTouched, touched, errors }}
                      />
                    </UploadPhotosField>
                    <UploadPhotosField>
                      <UploadTitleTypography>Sub Image:</UploadTitleTypography>
                      <DragAndDropSingleImageWithoutValidation
                        name="subImage"
                        file={values.subImage}
                        setFieldValue={setFieldValue}
                        error={touched.subImage && Boolean(errors.subImage)}
                        formik={{ setFieldValue, setFieldError, setTouched, touched, errors }}
                      />
                    </UploadPhotosField>
                  </UploadPhotosFieldBox>
                ) : (
                  <UploadPhotosFieldBox>
                    <UploadPhotosField>
                      <UploadTitleTypography>High resolution video:</UploadTitleTypography>
                      <DragAndDropSingleVideo
                        name="highResVideo"
                        file={values.highResVideo}
                        setFieldValue={setFieldValue}
                        error={touched.highResVideo && Boolean(errors.highResVideo)}
                        formik={{ setFieldValue, setFieldError, setTouched, touched, errors }}
                      />
                    </UploadPhotosField>
                    <UploadPhotosField>
                      <UploadTitleTypography>Low resolution video:</UploadTitleTypography>
                      <DragAndDropSingleVideo
                        name="lowResVideo"
                        file={values.lowResVideo}
                        setFieldValue={setFieldValue}
                        error={touched.lowResVideo && Boolean(errors.lowResVideo)}
                        formik={{ setFieldValue, setFieldError, setTouched, touched, errors }}
                      />
                    </UploadPhotosField>
                  </UploadPhotosFieldBox>
                )}
                <Box>
                  <Button variant="contained" type="submit" startIcon={<DocumentUpload />}>
                    Upload
                  </Button>
                </Box>
              </UploadPhotosMainContainer>
              <ImageAndVideoMediaGridContainer
                tab={tab}
                handleMediaClick={handleMediaClick}
                images={images}
                handleDeleteImage={handleDeleteImage}
                isAdmin
              />
            </UploadPhotosMainContainer>
          </form>
        }
      />
      <ImageAndVideoPreviewModal selectedMedia={selectedMedia} previewOpen={previewOpen} handlePreviewClose={handlePreviewClose} />
    </>
  );
};

export default UploadImageAndVideoDialog;

import { PlayCircle, Trash } from 'iconsax-react';
import React from 'react';
import { ImageAndVideoMediaGrid, ImageAndVideoMediaBox } from './ImageAndVideoModel.styled';
import {
  ImageAndVideoMediaBackDropBox,
  ImageStyledBox,
  TextTypographyContainer,
  VideoStyledBox,
} from './ImageAndVideoMediaGridContainer.styled';
import { FetchLotsImage } from 'services/event/event-action/upload-lots/type';
import { StyledIconButton } from 'views/event/event-action/upload-lots/UploadLots.styled';

const ImageAndVideoMediaGridContainer = ({
  tab,
  images,
  handleMediaClick,
  handleDeleteImage,
  isAdmin = false,
}: {
  tab: string;
  images: FetchLotsImage[];
  handleMediaClick: (media: FetchLotsImage) => void;
  handleDeleteImage?: (fileId: string, event: React.MouseEvent) => Promise<void>;
  isAdmin?: boolean;
}) => {
  const photosMedia = images.filter((item) => tab === 'photos' && item.fileType === 'image');
  const videosMedia = images.filter((item) => tab === 'videos' && item.fileType !== 'image');

  const filteredMedia = tab === 'photos' ? photosMedia : videosMedia;

  if (filteredMedia.length === 0 && !isAdmin) {
    return <TextTypographyContainer>{tab === 'photos' ? 'No photo found!' : 'No video found!'}</TextTypographyContainer>;
  }

  return photosMedia.length > 0 ? (
    <ImageAndVideoMediaGrid>
      {photosMedia.map((item, index) => (
        <ImageAndVideoMediaBox key={index} onClick={() => handleMediaClick(item)}>
          <ImageStyledBox src={item.url} alt={`img-${index}`} width={300} height={200} />
          {isAdmin && (
            <StyledIconButton onClick={(e) => handleDeleteImage?.(item.fileId, e)}>
              <Trash style={{ color: 'white' }} />
            </StyledIconButton>
          )}
        </ImageAndVideoMediaBox>
      ))}
    </ImageAndVideoMediaGrid>
  ) : (
    videosMedia.length > 0 && (
      <ImageAndVideoMediaGrid>
        {videosMedia.map((item, index) => (
          <ImageAndVideoMediaBox key={index} onClick={() => handleMediaClick(item)}>
            <>
              <VideoStyledBox>
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </VideoStyledBox>
              <ImageAndVideoMediaBackDropBox>
                <PlayCircle size="50" color="#fff" variant="Bold" />
              </ImageAndVideoMediaBackDropBox>
            </>
            {isAdmin && (
              <StyledIconButton onClick={(e) => handleDeleteImage?.(item.fileId, e)}>
                <Trash style={{ color: 'white' }} />
              </StyledIconButton>
            )}
          </ImageAndVideoMediaBox>
        ))}
      </ImageAndVideoMediaGrid>
    )
  );
};

export default ImageAndVideoMediaGridContainer;

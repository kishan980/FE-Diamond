import React, { SyntheticEvent } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ImageAndVideoContainer } from './ImageAndVideoModel.styled';

const ImageAndVideoModalTabs = ({
  tab,
  handleTabChange,
}: {
  tab: string;
  handleTabChange: (_event: SyntheticEvent, newValue: string) => void;
}) => {
  return (
    <ImageAndVideoContainer>
      <Tabs value={tab} onChange={handleTabChange} textColor="primary" indicatorColor="primary" variant="fullWidth">
        <Tab label="Photos" value="photos" sx={{ fontWeight: 500 }} />
        <Tab label="Videos" value="videos" sx={{ fontWeight: 500 }} />
      </Tabs>
    </ImageAndVideoContainer>
  );
};

export default ImageAndVideoModalTabs;

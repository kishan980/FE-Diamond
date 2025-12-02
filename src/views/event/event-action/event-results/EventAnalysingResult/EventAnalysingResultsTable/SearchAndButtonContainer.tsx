'use client';
import React from 'react';
import Button from '@mui/material/Button';
import { DocumentDownload, TickSquare } from 'iconsax-react';
import Box from '@mui/material/Box';
import { EventResultSearchButtonContainer, EventResultSearchContainer, YesAndNoContainer } from '../EventAnalysingResults.styled';
import { DownloadButton } from './EventAnalusingResultTable.styled';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { EventOrganizedForData } from 'services/event/types';
import { SearchAndButtonContainerProps } from 'types/events';

const SearchAndButtonContainer = ({
  selected,
  loading,
  sellerData,
  selectedID,
  handleSellerChange,
  handleClickExcelButton,
  handleAcceptBid,
  isSellerLoading,
}: SearchAndButtonContainerProps<EventOrganizedForData>) => {
  const isDisabled = selected.length === 0;
  return (
    <EventResultSearchButtonContainer>
      <EventResultSearchContainer>
        <SelectFormControl
          label="Seller"
          id="seller"
          value={selectedID}
          onChange={handleSellerChange}
          loading={isSellerLoading}
          options={sellerData.map((item) => ({ value: item.sellerName, label: item.sellerName }))}
          sx={{ width: '100%', maxWidth: { xs: '100%', sm: '190px' } }}
        />
      </EventResultSearchContainer>
      <YesAndNoContainer>
        <Button
          size="small"
          variant="contained"
          onClick={() => handleAcceptBid('accept')}
          disabled={selected.length === 0}
          startIcon={<TickSquare />}
        >
          Accept All
        </Button>
        <Button size="small" variant="outlined" onClick={() => handleAcceptBid('refuse')} disabled={isDisabled}>
          <Box
            component="img"
            src="/assets/icons/withdrawal.png"
            width={16}
            height={16}
            sx={{
              filter: isDisabled ? 'grayscale(100%) opacity(0.2)' : 'primary.main',
              mr: 1,
            }}
          />
          Withdraw All
        </Button>
        <DownloadButton
          variant="contained"
          onClick={() => handleClickExcelButton()}
          startIcon={<DocumentDownload />}
          disabled={loading?.isProgress}
        >
          Download Emergency Backup File
        </DownloadButton>
      </YesAndNoContainer>
    </EventResultSearchButtonContainer>
  );
};

export default SearchAndButtonContainer;

'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { SelectChangeEvent } from '@mui/material/Select';
import UploadLotsActionsGroupButton from './UploadLotsActionsGroupButton';
import { UploadLotsStackSelectBoxContainer, UploadLotsStackSelectContainer, UploadLotsStackSelectMainContainer } from './UploadLots.styled';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { UploadLotStackSelectContainerProps } from 'types/events';

const UploadLotStackSelectContainer: React.FC<UploadLotStackSelectContainerProps> = ({
  isSellerLoading,
  isMineLoading,
  eventId,
  remainingTime,
  mineData,
  sellerData,
  eventCategoryID,
  selectedMineID,
  selectedSellerID,
  setSelectedMineID,
  setIsInstructionDialogOpen,
  setSelectedSellerID,
  setUploadLotsCSVOpen,
  handleExportListOfLotsClick,
  handleSaveModificationClick,
  isLoading,
}) => {
  const [selectErrors, setSelectErrors] = useState({
    sellerError: false,
    mineError: false,
  });

  const handleSelectSeller = (event: SelectChangeEvent<number | string | boolean>) => {
    const value = event.target.value as string;
    setSelectedSellerID(value);
    if (value)
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        sellerError: false,
      }));
  };

  const handleSelectMine = (event: SelectChangeEvent<number | string | boolean>) => {
    const value = event.target.value as string;
    setSelectedMineID(value);
    if (value)
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        mineError: false,
      }));
  };

  const handleUploadLotsClick = () => {
    if (eventCategoryID === 1) {
      const sellerError = selectedSellerID === '';
      const mineError = selectedMineID === '';
      setSelectErrors({
        sellerError,
        mineError,
      });

      if (sellerError || mineError) return;
    }
    setUploadLotsCSVOpen(true);
  };

  return (
    <UploadLotsStackSelectMainContainer>
      {eventCategoryID === 1 && (remainingTime === 'Not Open Yet' || !remainingTime) ? (
        <UploadLotsStackSelectBoxContainer>
          <UploadLotsStackSelectContainer>
            <SelectFormControl
              label="Seller"
              id="seller"
              value={selectedSellerID || ''}
              onChange={handleSelectSeller}
              options={sellerData.map((item) => ({ value: item.sellerId, label: item.sellerName }))}
              loading={isSellerLoading}
              error={selectErrors.sellerError}
            />
            {selectErrors.sellerError && <FormHelperText error>Seller selection is required.</FormHelperText>}
          </UploadLotsStackSelectContainer>
          <UploadLotsStackSelectContainer>
            <SelectFormControl
              label="Mine"
              id="mine"
              value={selectedMineID || ''}
              onChange={handleSelectMine}
              options={mineData.map((item) => ({ value: item.id, label: item.name }))}
              loading={isMineLoading}
              error={selectErrors.mineError}
            />
            {selectErrors.mineError && <FormHelperText error>Mine selection is required.</FormHelperText>}
          </UploadLotsStackSelectContainer>
        </UploadLotsStackSelectBoxContainer>
      ) : (
        <Box></Box>
      )}

      <UploadLotsActionsGroupButton
        {...{
          handleUploadLotsClick,
          handleExportListOfLotsClick,
          handleSaveModificationClick,
          setIsInstructionDialogOpen,
          remainingTime,
          eventId,
          eventCategoryID,
          isLoading,
        }}
      />
    </UploadLotsStackSelectMainContainer>
  );
};

export default UploadLotStackSelectContainer;

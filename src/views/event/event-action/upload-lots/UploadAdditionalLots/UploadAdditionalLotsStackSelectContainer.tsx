'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import {
  UploadLotsStackSelectMainContainer,
  UploadLotsStackSelectBoxContainer,
  UploadLotsStackSelectContainer,
} from '../UploadLots.styled';
import UploadAdditionalLotsActionsGroupButton from './UploadAdditionalLotsActionsGroupButton';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { UploadLotStackSelectContainerProps } from 'types/events';

const UploadAdditionalLotsStackSelectContainer: React.FC<UploadLotStackSelectContainerProps> = ({
  isSellerLoading,
  isMineLoading,
  mineData,
  sellerData,
  eventCategoryID,
  selectedMineID,
  selectedSellerID,
  setSelectedMineID,
  setIsInstructionDialogOpen,
  setSelectedSellerID,
  setUploadLotsCSVOpen,
}) => {
  const [selectErrors, setSelectErrors] = useState({
    sellerError: false,
    mineError: false,
  });

  const handleSelectSeller = (event: SelectChangeEvent<number | string | boolean>) => {
    const value = event.target.value as string;
    setSelectedSellerID(value);
    if (value) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        sellerError: false,
      }));
    }
  };

  const handleSelectMine = (event: SelectChangeEvent<number | string | boolean>) => {
    const value = event.target.value as string;
    setSelectedMineID(value);
    if (value) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        mineError: false,
      }));
    }
  };

  const handleUploadLotsClick = () => {
    if (eventCategoryID === 1) {
      const sellerError = selectedSellerID === '';
      const mineError = selectedMineID === '';

      setSelectErrors({
        sellerError,
        mineError,
      });

      if (sellerError || mineError) {
        return;
      }
    }
    setUploadLotsCSVOpen(true);
  };

  return (
    <UploadLotsStackSelectMainContainer>
      {eventCategoryID === 1 ? (
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
            {selectErrors.sellerError && <FormHelperText error>Seller selection is required</FormHelperText>}
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
      <UploadAdditionalLotsActionsGroupButton {...{ handleUploadLotsClick, setIsInstructionDialogOpen }} />
    </UploadLotsStackSelectMainContainer>
  );
};

export default UploadAdditionalLotsStackSelectContainer;

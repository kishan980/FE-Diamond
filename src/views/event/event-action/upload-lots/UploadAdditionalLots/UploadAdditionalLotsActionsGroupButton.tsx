'use client';
import React from 'react';
import Button from '@mui/material/Button';
import { DocumentText, DocumentUpload } from 'iconsax-react';
import { UploadLotsStackButtonContainer } from '../UploadLots.styled';
import { UploadLotsActionsGroupProps } from 'types/events';

const UploadAdditionalLotsActionsGroupButton = ({ handleUploadLotsClick, setIsInstructionDialogOpen }: UploadLotsActionsGroupProps) => (
  <UploadLotsStackButtonContainer>
    <Button
      variant="outlined"
      onClick={handleUploadLotsClick}
      startIcon={<DocumentUpload />}
      sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
    >
      Upload Lots
    </Button>

    <Button
      variant="outlined"
      onClick={() => setIsInstructionDialogOpen(true)}
      startIcon={<DocumentText />}
      sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
    >
      Upload Instructions
    </Button>
  </UploadLotsStackButtonContainer>
);

export default UploadAdditionalLotsActionsGroupButton;

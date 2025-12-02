'use client';
import Button from '@mui/material/Button';
import { DocumentText, DocumentUpload } from 'iconsax-react';
import Link from 'next/link';
import LoadingButton from '@mui/lab/LoadingButton';
import { UploadButton, UploadLotsStackButtonContainer } from './UploadLots.styled';
import { UploadLotsActionsGroupProps } from 'types/events';

const UploadLotsActionsGroupButton = ({
  eventId,
  remainingTime,
  eventCategoryID,
  handleUploadLotsClick,
  handleExportListOfLotsClick,
  handleSaveModificationClick,
  setIsInstructionDialogOpen,
  isLoading,
}: UploadLotsActionsGroupProps) => (
  <UploadLotsStackButtonContainer>
    <LoadingButton
      variant="outlined"
      onClick={handleExportListOfLotsClick}
      loading={isLoading?.isButtonLoading}
      startIcon={<DocumentText />}
      sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
    >
      Export List of Lots for Invitees
    </LoadingButton>

    {remainingTime === 'Not Open Yet' && (
      <>
        <Button
          variant="outlined"
          onClick={handleUploadLotsClick}
          startIcon={<DocumentUpload />}
          disabled={isLoading?.isButtonLoading}
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
      </>
    )}
    {remainingTime &&
      remainingTime !== 'Not Open Yet' &&
      remainingTime !== 'Closed' &&
      remainingTime !== 'Bid submission period is ongoing' && (
        <>
          {eventCategoryID === 2 && (
            <Button
              variant="outlined"
              onClick={handleSaveModificationClick}
              startIcon={<DocumentText />}
              disabled={isLoading?.isButtonLoading}
              sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
            >
              Save Modifications
            </Button>
          )}
          {remainingTime && (
            <Link href={`/events/upload-lots/upload-additional-lots/${eventId}`}>
              <UploadButton variant="outlined" startIcon={<DocumentText />}>
                Upload Additional Lot(s)
              </UploadButton>
            </Link>
          )}
        </>
      )}
  </UploadLotsStackButtonContainer>
);

export default UploadLotsActionsGroupButton;

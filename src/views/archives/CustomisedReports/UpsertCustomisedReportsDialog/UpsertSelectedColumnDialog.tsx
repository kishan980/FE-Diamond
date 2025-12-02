'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {
  UpsertCustomisedButtontainer,
  UpsertSelectedColumnContainer,
  UpsertSelectedMainColumnContainer,
} from './UpsertCustomisedReportsDialog.styled';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import { SelectColumnDialogProps } from 'types/dialog';
import { AllItems, SelectColumnData } from 'services/archives/customisedReports/types';

const UpsertSelectedColumnDialog: React.FC<SelectColumnDialogProps> = ({
  open,
  handleClose,
  onSubmit,
  selectColumnData,
  loading,
  selectColumnValues,
  setSelectColumnValues,
}) => {
  const handleCheckboxChange = (columnName: string, displayName: string) => {
    setSelectColumnValues((prev) => {
      const exists = prev.some((item) => item.COLUMN_NAME === columnName);
      if (exists) {
        return prev.filter((item) => item.COLUMN_NAME !== columnName); // Remove the item based on COLUMN_NAME
      } else {
        return [...prev, { COLUMN_NAME: columnName, DISPLAY_NAME: displayName }]; // Add object with COLUMN_NAME and DISPLAY_NAME
      }
    });
  };

  const handleSelectAll = (category: string, allItems: AllItems): void => {
    setSelectColumnValues((prev) => {
      const isAllSelected = allItems.every((item) => prev.some((selected) => selected.COLUMN_NAME === item.COLUMN_NAME));
      return isAllSelected
        ? prev.filter((value) => !allItems.some((item) => item.COLUMN_NAME === value.COLUMN_NAME)) // Deselect all
        : [...prev, ...allItems.filter((item) => !prev.some((selected) => selected.COLUMN_NAME === item.COLUMN_NAME))]; // Select all
    });
  };

  const handleSubmit = () => {
    onSubmit(selectColumnValues);
    handleClose();
  };

  const categoryDisplayNameMap: Record<string, string> = {
    CMP: 'Company Details',
    BIDDER: 'Bidder Details',
    BIDDINGPER: 'Bidding Performance',
    PERFORMANCE: 'Bidders Performance',
  };

  // Group data by category
  const groupedData = selectColumnData.reduce(
    (acc, item) => {
      if (typeof item.DATA_FOR === 'string') {
        acc[item.DATA_FOR] = acc[item.DATA_FOR] || [];
        acc[item.DATA_FOR].push(item);
      }
      return acc;
    },
    {} as Record<string, SelectColumnData[]>
  );
  return (
    <>
      {loading.isLoading && <CircularLoader isProgress={loading.isLoading} />}
      <CustomDialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        title="Please select the columns to be generated in the report:"
        content={
          <UpsertSelectedMainColumnContainer>
            {Object.entries(groupedData).map(([category, items]) => {
              const allItems = items.map((item) => ({ COLUMN_NAME: item.COLUMN_NAME, DISPLAY_NAME: item.DISPLAY_NAME }));
              const isAllSelected = allItems.every((item) => selectColumnValues.some((value) => value.COLUMN_NAME === item.COLUMN_NAME));
              return (
                <UpsertSelectedColumnContainer key={category}>
                  <Typography variant="h5">{categoryDisplayNameMap[category] || category}</Typography>
                  <FormControlLabel
                    control={<Checkbox checked={isAllSelected} onChange={() => handleSelectAll(category, allItems)} />}
                    label="Select All"
                  />
                  <Divider />

                  {items.map((item) => (
                    <Box key={item.COLUMN_NAME} sx={{ display: 'flex', alignItems: 'center', marginLeft: '-11px' }}>
                      <Checkbox
                        checked={selectColumnValues.some((selected) => selected.COLUMN_NAME === item.COLUMN_NAME)}
                        onChange={() => handleCheckboxChange(item.COLUMN_NAME, item.DISPLAY_NAME)}
                        sx={{ p: 1 }}
                      />
                      <Typography variant="body2">{item.DISPLAY_NAME}</Typography>
                    </Box>
                  ))}
                </UpsertSelectedColumnContainer>
              );
            })}
          </UpsertSelectedMainColumnContainer>
        }
        actions={
          <UpsertCustomisedButtontainer>
            <Button onClick={handleSubmit} variant="contained">
              Apply Filter
            </Button>
          </UpsertCustomisedButtontainer>
        }
      />
    </>
  );
};

export default UpsertSelectedColumnDialog;

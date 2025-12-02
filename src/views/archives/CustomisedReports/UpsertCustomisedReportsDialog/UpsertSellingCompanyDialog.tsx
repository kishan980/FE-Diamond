'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CloseCircle } from 'iconsax-react';
import Divider from '@mui/material/Divider';
import { ConfirmModelButton } from './UpsertCustomisedReportsDialog.styled';
import AnimateButton from 'components/@extended/AnimateButton';
import CircularLoader from 'components/UIComponent/CircularLoader';
import { SellingCompanyValue } from 'services/archives/customisedReports/types';
import { SellingCompanyDialogProps } from 'types/dialog';

const UpsertSellingCompanyDialog = ({
  open,
  handleClose,
  onSubmit,
  sellerData,
  loading,
  selectSellerValues,
  setSelectSellerValues,
}: SellingCompanyDialogProps<SellingCompanyValue>) => {
  const handleCheckboxChange = (co_name: string, entityID: number) => {
    setSelectSellerValues((prev) => {
      const exists = prev.some((item) => item.entityID === entityID.toString());
      if (exists) {
        return prev.filter((item) => item.entityID !== entityID.toString());
      } else {
        return [...prev, { co_name, entityID: entityID.toString() }];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectSellerValues.length === sellerData.length) {
      setSelectSellerValues([]);
    } else {
      setSelectSellerValues(sellerData.map((item) => ({ co_name: item.co_name, entityID: item.entityID.toString() })));
    }
  };

  const handleSubmit = () => {
    onSubmit(selectSellerValues);
    handleClose();
  };
  return (
    <>
      {loading.isLoading && <CircularLoader isProgress={loading.isLoading} />}
      <Dialog open={open} fullWidth maxWidth="xs">
        <DialogTitle>Please select the selling company:</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectSellerValues.length === sellerData.length && sellerData.length > 0}
                indeterminate={selectSellerValues.length > 0 && selectSellerValues.length < sellerData.length}
                onChange={handleSelectAll}
              />
            }
            label="Select All"
          />
          <Divider />
          <Box display="flex" flexDirection="column" gap={0.5}>
            {sellerData.map((item) => (
              <FormControlLabel
                key={item.entityID}
                control={
                  <Checkbox
                    checked={selectSellerValues.some((selected) => selected.entityID === item.entityID.toString())}
                    onChange={() => handleCheckboxChange(item.co_name, item.entityID)}
                    sx={{ p: 1 }}
                  />
                }
                label={item.co_name}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <AnimateButton>
            <ConfirmModelButton variant="contained" onClick={handleSubmit} fullWidth size="small">
              Apply Filter
            </ConfirmModelButton>
          </AnimateButton>
          <Button variant="outlined" color="error" size="small" onClick={handleClose} startIcon={<CloseCircle />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpsertSellingCompanyDialog;

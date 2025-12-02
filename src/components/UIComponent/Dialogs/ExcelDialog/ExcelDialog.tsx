'use client';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import { ClipboardClose, ClipboardText, CloseCircle } from 'iconsax-react';
import LoadingButton from '@mui/lab/LoadingButton';
import { ExcelDialogContainer, ExcelDialogPaper } from './ExcelDialog.styled';
import { ExcelDialogProps } from 'types/dialog';

const ExcelDialog = ({ open, handleClose, handleDataWithFormula, title, handleDataWithoutFormula, dataGetLoader }: ExcelDialogProps) => (
  <Dialog open={open} onClose={handleClose}>
    <Box sx={{ textAlign: 'right', padding: 0.5 }}>
      <CloseCircle size="24" color="#555555" style={{ cursor: 'pointer' }} onClick={handleClose} />
    </Box>
    <ExcelDialogContainer>
      <DialogContentText sx={{ fontSize: '16px', fontWeight: 500 }}>{title}</DialogContentText>
      <ExcelDialogPaper>
        <LoadingButton
          variant="outlined"
          onClick={handleDataWithFormula}
          startIcon={
            <ClipboardText
              style={{
                opacity: dataGetLoader === 'dataWithout' || dataGetLoader === 'dataWith' ? 0.5 : 1,
              }}
            />
          }
          disabled={dataGetLoader === 'dataWithout'}
          loading={dataGetLoader === 'dataWith'}
          sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
        >
          Data With formula
        </LoadingButton>

        <LoadingButton
          variant="outlined"
          onClick={handleDataWithoutFormula}
          startIcon={
            <ClipboardClose
              style={{
                opacity: dataGetLoader === 'dataWith' || dataGetLoader === 'dataWithout' ? 0.5 : 1,
              }}
            />
          }
          disabled={dataGetLoader === 'dataWith'}
          loading={dataGetLoader === 'dataWithout'}
          sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
        >
          Data Without formula
        </LoadingButton>
      </ExcelDialogPaper>
    </ExcelDialogContainer>
  </Dialog>
);

export default ExcelDialog;

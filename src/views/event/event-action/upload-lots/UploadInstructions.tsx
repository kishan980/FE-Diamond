'use client';
import React from 'react';

// MATERIAL - UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// ASSETS
import { ArrowRight } from 'iconsax-react';

// PROJECT IMPORTS
import { UploadDescriptionFieldContainer, UploadDescriptionMain, UploadDescriptionMainContainer } from './UploadLots.styled';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';

// TYPES
import { UploadInstructionsDialogProps } from 'types/dialog';

const UploadInstructions = ({ open, handleClose, eventCategoryID }: UploadInstructionsDialogProps) => (
  <CustomDialog
    open={open}
    onClose={handleClose}
    content={
      <UploadDescriptionMainContainer>
        <Typography>
          The file you upload must be an Excel with each field specified below. The first row should contain the field headers.
        </Typography>
        <Box>
          <Grid sx={{ display: 'flex', gap: 1.5 }}>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <UploadDescriptionMain>
                <Typography>
                  <b>Field Header</b>
                </Typography>
                <Box>
                  {[
                    'Lot No',
                    ...(eventCategoryID === 1 ? ['Size Range', 'Lot Description', 'Weight (Carats)'] : []),
                    ...(eventCategoryID === 2 ? ['Shape', 'Carats', 'Color', 'Clarity', 'Cut', 'Comment'] : []),
                    'Stone Count',
                    'Reserve Price (US$)',
                    'Type of Sale',
                  ].map((field) => (
                    <UploadDescriptionFieldContainer key={field}>
                      <ArrowRight size="15" color="#FF8A65" />
                      <Typography>{field}</Typography>
                    </UploadDescriptionFieldContainer>
                  ))}
                </Box>
              </UploadDescriptionMain>
            </Grid>
            <Grid item xs={12} sm={6} md={8} lg={8}>
              <UploadDescriptionMain>
                <Typography>
                  <b>Acceptable Field Values</b>
                </Typography>
                <Box>
                  {[
                    'Unique and compulsory for parcel stock upload',
                    ...(eventCategoryID === 1 ? ['Text format', 'Text format', 'Total carat weight including two decimal points'] : []),
                    ...(eventCategoryID === 2
                      ? [
                          'Text format',
                          'Total carat weight including two decimal points',
                          'Text format',
                          'Text format',
                          'Text format',
                          'Text format',
                        ]
                      : []),
                    'Number of stones (if available)',
                    'Reserve Price (if available)',
                    'Text format',
                  ].map((field) => (
                    <UploadDescriptionFieldContainer key={field}>
                      <Typography>{field}</Typography>
                    </UploadDescriptionFieldContainer>
                  ))}
                </Box>
              </UploadDescriptionMain>
            </Grid>
          </Grid>
        </Box>
      </UploadDescriptionMainContainer>
    }
  />
);

export default UploadInstructions;

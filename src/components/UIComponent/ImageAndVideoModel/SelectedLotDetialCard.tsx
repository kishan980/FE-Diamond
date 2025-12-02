import React from 'react';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { ImageAndVideoCard } from './ImageAndVideoModel.styled';
import { SelectedLotDetialBox } from './SelectedLotDetialCard.styled';
import { GetAllLotsData } from 'services/bidder/all-lots/type';

const SelectedLotDetialCard = ({ selectedLot }: { selectedLot: GetAllLotsData | null }) => {
  return (
    <ImageAndVideoCard>
      {selectedLot && (
        <CardContent sx={{ padding: '0 !important' }}>
          {[
            { label: 'Lot No', value: selectedLot.SeqNo },
            { label: 'Size Range', value: selectedLot.Size },
            { label: 'Stone Count', value: selectedLot.pcs },
            { label: 'Weight (Carats)', value: selectedLot.cts },
            { label: 'Description', value: selectedLot.stockDesc },
          ].map((item, index, arr) => (
            <SelectedLotDetialBox key={index} isLast={index === arr.length - 1}>
              <Typography sx={{ fontWeight: 600, width: '40%' }}>{item.label}</Typography>
              <Typography sx={{ width: '60%', textAlign: 'right' }}>{item.value}</Typography>
            </SelectedLotDetialBox>
          ))}
        </CardContent>
      )}
    </ImageAndVideoCard>
  );
};

export default SelectedLotDetialCard;

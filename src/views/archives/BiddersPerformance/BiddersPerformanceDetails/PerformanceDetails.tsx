'use client';
import Typography from '@mui/material/Typography';
import { StyledTotalValueWrapper, StyledTotalValueContent, StyledTotalValueRow } from 'views/common.styled';
import { PerformanceDetailsProps } from 'types/bidder';

const PerformanceDetails = ({ data }: PerformanceDetailsProps) => (
  <StyledTotalValueWrapper p={1.5}>
    <StyledTotalValueContent>
      {data.map(({ label, value }, index) => (
        <StyledTotalValueRow key={index}>
          <Typography variant="h6" color="text.secondary">
            {label ?? '-'}
          </Typography>
          <Typography variant="h5" color="primary">
            {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(Number(value) || 0)}
          </Typography>
        </StyledTotalValueRow>
      ))}
    </StyledTotalValueContent>
  </StyledTotalValueWrapper>
);

export default PerformanceDetails;

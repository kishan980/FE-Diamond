'use client';
import Typography from '@mui/material/Typography';
import { ArrowLeft2 } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import PrintIconButton from '../IconButtons/PrintButton';
import { UpsertTitleMainContainer } from './UpsertTitleContainer.styled';
import { UpsertTitleContainerProps } from 'types/events';
import { UpsertTitleTypography } from 'views/common.styled';

const UpsertTitleContainer = ({ id, entityName }: UpsertTitleContainerProps) => {
  const { back } = useRouter();

  return (
    <UpsertTitleMainContainer className="print-card-hidden-title">
      <UpsertTitleTypography onClick={() => back()}>
        <ArrowLeft2 />
        <Typography variant="h4">{id ? `Update ${entityName}` : `Add ${entityName}`}</Typography>
      </UpsertTitleTypography>
      <PrintIconButton title="Print" onClick={() => window.print()} />
    </UpsertTitleMainContainer>
  );
};

export default UpsertTitleContainer;

import Typography from '@mui/material/Typography';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';
import { UpsertTitleMainContainer } from 'components/UIComponent/UpsertTitleContainer/UpsertTitleContainer.styled';

const MyProfileTitleContainer = () => (
  <UpsertTitleMainContainer className="print-card-hidden-title">
    <Typography variant="h5">Profile</Typography>
    <PrintIconButton title="Print" onClick={() => window.print()} />
  </UpsertTitleMainContainer>
);

export default MyProfileTitleContainer;

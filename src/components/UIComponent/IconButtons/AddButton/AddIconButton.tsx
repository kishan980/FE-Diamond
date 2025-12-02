import Button from '@mui/material/Button';
import { Add } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const AddIconButton = ({ onClick, title }: { onClick?: () => void; title: string }) => {
  const theme = useTheme();
  const upSM = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Button
      type="submit"
      size={upSM ? 'medium' : 'small'}
      startIcon={<Add />}
      color="primary"
      variant="contained"
      onClick={onClick}
      sx={{ whiteSpace: 'nowrap', height: 'fit-content', px: { xs: 0.75, sm: 1.5 } }}
    >
      {title}
    </Button>
  );
};

export default AddIconButton;

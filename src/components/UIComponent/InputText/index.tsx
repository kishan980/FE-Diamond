import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const InputText = styled(TextField)(() => ({
  '& .MuiInputBase-root': {
    height: '100%',
    '& .MuiOutlinedInput-input': { padding: '6.5px 14px' },
  },
}));

export default InputText;

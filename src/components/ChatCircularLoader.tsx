import Stack from '@mui/material/Stack';
import CircularWithPath from './@extended/progress/CircularWithPath';

const ChatCircularLoader = () => {
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 1 }}>
      <CircularWithPath />
    </Stack>
  );
};

export default ChatCircularLoader;

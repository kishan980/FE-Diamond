import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { KeyboardEvent, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { EmojiHappy, Send } from '@wandersonalwes/iconsax-react';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import EmojiPicker, { SkinTones, EmojiClickData } from 'emoji-picker-react';
import { StyledBottomBar, StyledChatActions, StyledTextInput } from './AllLots/ChatAllLots.styled';
import MainCard from 'components/MainCard';
import { ChatRoomAllBiddersOrLotsData } from 'services/event/event-action/auction-room/type';

const ChatBottomBar = ({
  message,
  setMessage,
  handleOnSend,
  data,
}: {
  message: string;
  setMessage: (message: string) => void;
  handleOnSend: () => void;
  data: ChatRoomAllBiddersOrLotsData[];
}) => {
  const theme = useTheme();
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));
  const textInputRef = useRef<HTMLInputElement>(null);
  const [anchorElEmoji, setAnchorElEmoji] = useState<any>();
  const emojiOpen = Boolean(anchorElEmoji);
  const emojiId = emojiOpen ? 'simple-popper' : undefined;

  const handleEmojiToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElEmoji(anchorElEmoji ? null : event?.currentTarget);
  };

  const handleOnEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage(message + emojiObject.emoji);
  };

  const handleEnterKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') handleOnSend();
  };
  return (
    <StyledBottomBar item xs={12}>
      <Stack>
        <StyledTextInput
          inputRef={textInputRef}
          fullWidth
          multiline
          rows={4}
          placeholder="Your Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value.length <= 1 ? e.target.value.trim() : e.target.value)}
          onKeyDown={handleEnterKey}
          variant="standard"
        />
        <StyledChatActions direction="row">
          <Stack direction="row" spacing={0}>
            <IconButton
              ref={anchorElEmoji}
              aria-describedby={emojiId}
              onClick={handleEmojiToggle}
              sx={{ opacity: 0.5 }}
              size="small"
              color="secondary"
            >
              <EmojiHappy />
            </IconButton>
            <Popper
              id={emojiId}
              open={emojiOpen}
              anchorEl={anchorElEmoji}
              disablePortal
              style={{ zIndex: 1200 }}
              popperOptions={{
                modifiers: [
                  {
                    name: 'offset',
                    options: { offset: [-10, 10] },
                  },
                ],
              }}
            >
              <ClickAwayListener onClickAway={() => setAnchorElEmoji(null)}>
                <MainCard elevation={8} content={false}>
                  <EmojiPicker
                    onEmojiClick={handleOnEmojiClick}
                    defaultSkinTone={SkinTones.DARK}
                    autoFocusSearch={false}
                    width={isSmallDown ? 260 : 300}
                  />
                </MainCard>
              </ClickAwayListener>
            </Popper>
          </Stack>
          <IconButton
            color="primary"
            onClick={handleOnSend}
            size="medium"
            sx={{ mr: 1.5 }}
            disabled={message.trim() === '' || data[0]?.selectAllBiddersAndLots[0]?.TimeLeft === 'Closed'}
          >
            <Send />
          </IconButton>
        </StyledChatActions>
      </Stack>
    </StyledBottomBar>
  );
};

export default ChatBottomBar;

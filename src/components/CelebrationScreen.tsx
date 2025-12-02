import React from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { CelebrationMainBox, CelebrationSubtitle, CelebrationTitle } from './CelebrationScreen.styled';

const CelebrationScreen = () => {
  const { width, height } = useWindowSize();

  return (
    <CelebrationMainBox>
      <Confetti width={width} height={height} />
      <CelebrationTitle variant="h2">🎉 Congratulations! 🎉</CelebrationTitle>
      <CelebrationSubtitle variant="h5">You’ve won lots in this event!</CelebrationSubtitle>
    </CelebrationMainBox>
  );
};

export default CelebrationScreen;

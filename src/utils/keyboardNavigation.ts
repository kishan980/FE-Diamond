import { KeyboardEvent } from 'react';

export function handleInputNavigation(e: KeyboardEvent<HTMLInputElement>, submitForm?: () => void) {
  const input = e.target as HTMLInputElement;
  const focusable = document.querySelectorAll<HTMLInputElement>('input[type="number"]:not([disabled]):not([readonly])');

  const currentIndex = Array.from(focusable).indexOf(input);
  let nextIndex = currentIndex;

  switch (e.key) {
    case 'ArrowUp':
      nextIndex = currentIndex - 2;
      break;
    case 'ArrowDown':
      nextIndex = currentIndex + 2;
      break;
    case 'ArrowLeft':
      nextIndex = currentIndex - 1;
      break;
    case 'ArrowRight':
      nextIndex = currentIndex + 1;
      break;
    case 'Enter':
      e.preventDefault();
      if (submitForm) {
        submitForm();
      } else {
        input.form?.requestSubmit();
      }
      return;
    default:
      return;
  }

  e.preventDefault();
  if (focusable[nextIndex]) {
    focusable[nextIndex].focus();
    focusable[nextIndex].select();
  }
}

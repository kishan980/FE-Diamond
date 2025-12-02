import { generateRandomPassword } from './password.utils';

export const handleGeneratePassword = (
  setGeneratePassword: (password: string) => void,
  setValues: (callback: (prevValues: any) => any) => void
) => {
  const generatedPassword = generateRandomPassword();
  setGeneratePassword(generatedPassword);
  setValues((prevValues) => ({
    ...prevValues,
    password: generatedPassword,
    confirmpassword: generatedPassword,
  }));
};

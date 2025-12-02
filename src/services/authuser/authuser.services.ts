import axios from 'axios';
import type { ForgotPasswordParams, ForgotPasswordResponse, LoginUserParams, LoginUserResponse } from './types';
import { ErrorMessage } from 'constants/common.constants';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/`;

export class AuthServices {
  static loginUser = async (params: LoginUserParams): Promise<LoginUserResponse | string> => {
    try {
      const res = await axios.post<LoginUserResponse>(`${API_BASE_URL}login`, params, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in login:', error);
      return ErrorMessage;
    }
  };

  static forgotPassword = async (params: ForgotPasswordParams): Promise<ForgotPasswordResponse | string> => {
    try {
      const res = await axios.post<ForgotPasswordResponse>(`${API_BASE_URL}/bidderforgotPassword`, params, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in forgot password:', error);
      return ErrorMessage;
    }
  };
}

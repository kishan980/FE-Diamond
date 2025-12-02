// Extend the Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export class ReCaptchaService {
  static generateToken = async (): Promise<string | null> => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      // eslint-disable-next-line no-console
      console.warn('Missing reCAPTCHA site key.');
      return null;
    }

    if (typeof window !== 'undefined' && window.grecaptcha) {
      const token = await window.grecaptcha.execute(siteKey, { action: 'submit' });
      return token;
    }

    return null;
  };
}

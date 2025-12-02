'use client';
import { ReactElement } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import ThemeCustomization from 'themes';
import { ConfigProvider } from 'contexts/ConfigContext';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Notistack from 'components/third-party/Notistack';
import Snackbar from 'components/@extended/Snackbar';

const ProviderWrapper = ({ children }: { children: ReactElement }) => (
  <ConfigProvider>
    <ThemeCustomization>
      <Locales>
        <ScrollTop>
          <SessionProvider refetchInterval={0}>
            <Notistack>
              <Snackbar />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              {children}
            </Notistack>
          </SessionProvider>
        </ScrollTop>
      </Locales>
    </ThemeCustomization>
  </ConfigProvider>
);

export default ProviderWrapper;

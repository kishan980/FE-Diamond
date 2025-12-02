import { ReactNode } from 'react';
import DashboardLayout from 'layout/DashboardLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';
import '../../styles/auth-layout.css';
import PageTitleUpdater from 'components/PageTitleUpdater';
import { FooterProvider } from 'contexts/FooterContext';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <FooterProvider>
        <DashboardLayout>
          <PageTitleUpdater />
          {children}
        </DashboardLayout>
      </FooterProvider>
    </AuthGuard>
  );
}

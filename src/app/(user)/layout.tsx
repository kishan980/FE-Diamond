import { ReactNode } from 'react';
import UserLayout from 'layout/UserLayout';
import UserGuard from 'utils/route-guard/UserGuard';
import PageTitleUpdater from 'components/PageTitleUpdater';
import '../../styles/auth-layout.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <UserGuard>
      <UserLayout>
        <PageTitleUpdater />
        {children}
      </UserLayout>
    </UserGuard>
  );
}

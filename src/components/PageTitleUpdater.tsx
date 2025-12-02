'use client';
import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { getPageTitle } from 'utils/metadata';

const PageTitleUpdater = () => {
  const pathname = usePathname();
  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default PageTitleUpdater;

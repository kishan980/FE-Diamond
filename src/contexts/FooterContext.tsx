'use client';
import { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { HomePageServices } from 'services/homepage/homepage.services';
import { CompanyData } from 'services/homepage/type';

interface FooterContextProps {
  data: CompanyData | null;
  loading: boolean;
  refreshFooter: () => Promise<void>;
}

const FooterContext = createContext<FooterContextProps>({
  data: null,
  loading: false,
  refreshFooter: async () => {},
});

export const FooterProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshFooter = useCallback(async () => {
    setLoading(true);
    try {
      const res = await HomePageServices.footerList();
      if (typeof res !== 'string' && res.success) {
        setData(res.data);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching company details footer:', err);
      toast.error('An error occurred while fetching company details');
    } finally {
      setLoading(false);
    }
  }, []);

  return <FooterContext.Provider value={{ data, loading, refreshFooter }}>{children}</FooterContext.Provider>;
};

export const useFooter = () => useContext(FooterContext);

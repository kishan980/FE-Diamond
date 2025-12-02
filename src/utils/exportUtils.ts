import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { downloadFile } from './fileDownloadUtils';
import { LoadingState } from 'types/table';

export const handleXMLExport = async <T>(
  serviceCall: () => Promise<{ success: boolean; data: T } | string>,
  fileName: string,
  exportFormatter: (data: T) => string,
  setLoading: Dispatch<SetStateAction<LoadingState>>
) => {
  setLoading((prev) => ({ ...prev, isXlsxButtonLoading: true }));

  try {
    const res = await serviceCall();

    if (typeof res !== 'string' && res.success) {
      const formattedXML = exportFormatter(res.data);
      downloadFile(formattedXML, fileName, 'application/xml');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error occurred during export handleXMLExport:', error);
    toast.error('Error occurred during export');
  } finally {
    setLoading((prev) => ({ ...prev, isXlsxButtonLoading: false }));
  }
};

export const handleExcelExport = async (
  serviceCall: () => Promise<AxiosResponse<Blob> | null>,
  setLoading: Dispatch<SetStateAction<LoadingState>>,
  loadingKey: keyof LoadingState = 'isExcelButtonLoading'
) => {
  setLoading((prev) => ({ ...prev, [loadingKey]: true }));

  try {
    const response = await serviceCall();

    if (!response) {
      toast.error('Failed to download report');
      return;
    }

    const disposition = response.headers['content-disposition'];
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // optional: set a filename with `.xlsx` extension
    link.setAttribute('download', disposition);

    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error occurred during export handleExcelExport:', error);
    toast.error('Error occurred during export');
  } finally {
    setLoading((prev) => ({ ...prev, [loadingKey]: false }));
  }
};

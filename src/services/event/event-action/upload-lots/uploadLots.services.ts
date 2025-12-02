import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  AddSaveAdditionalLotsParams,
  AddSaveAdditionalLotsResponse,
  AddSaveLotsParams,
  AddUploadAdditionalLotsParams,
  AddUploadAdditionalLotsResponse,
  AddUploadLotsParams,
  AddUploadLotsResponse,
  AddUploadStockDetailsParams,
  DeleteImageResponse,
  DeleteLotsParams,
  DeleteOngoingEventLotsResponse,
  DeleteUploadLotsParams,
  FetchImagesResponse,
  ImportUploadLotsResponse,
  ImportUploadStockDetailsResponse,
  TransfterToOngoingEventResponse,
  UpdateGetStockDetailsForExportParams,
  UploadAdditionalLotsByIdResponse,
  UploadImagesParams,
  UploadImagesResponse,
  UploadLotsByIdResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel, axiosFormData } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`;

export class UploadLotsServices {
  private static showError(
    data: UploadLotsByIdResponse | AddUploadLotsResponse | UploadImagesResponse | UploadAdditionalLotsByIdResponse | FetchImagesResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static uploadLotsById = async (id: number): Promise<UploadLotsByIdResponse | string> => {
    try {
      const res = await axiosClient.get<UploadLotsByIdResponse>(`${API_BASE_URL}/getStockDetails/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getStockDetails:', error);
      return ErrorMessage;
    }
  };

  static addUploadLots = async (params: AddSaveLotsParams): Promise<AddUploadLotsResponse | string> => {
    try {
      const res = await axiosClient.post<AddUploadLotsResponse>(`${API_BASE_URL}/saveLots`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in saveLots:', error);
      return ErrorMessage;
    }
  };

  static deleteUploadLots = async (params: DeleteUploadLotsParams): Promise<AddUploadLotsResponse | string> => {
    try {
      const res = await axiosClient.post<AddUploadLotsResponse>(`${API_BASE_URL}/deleteLots`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in deleteLots:', error);
      return ErrorMessage;
    }
  };

  static importUploadLots = async (params: AddUploadLotsParams): Promise<ImportUploadLotsResponse | string> => {
    try {
      const formData = new FormData();

      formData.append('file', params.file);
      formData.append('sellerId', params.sellerId.toString());
      formData.append('mineId', params.mineId.toString());
      formData.append('eventId', params.eventId.toString());
      formData.append('type', params.type);

      const res = await axiosFormData().post<ImportUploadLotsResponse>(`${API_BASE_URL}/uploadLots`, formData);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in uploadLots:', error);
      return ErrorMessage;
    }
  };

  static uploadAdditionalLotsById = async (id: number): Promise<UploadAdditionalLotsByIdResponse | string> => {
    try {
      const res = await axiosClient.get<UploadAdditionalLotsByIdResponse>(`${API_BASE_URL}/fetchOngoingDetails/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in fetchOngoingDetails:', error);
      return ErrorMessage;
    }
  };

  static transfterToOngoingEvent = async (id: number): Promise<TransfterToOngoingEventResponse | string> => {
    try {
      const res = await axiosClient.post<TransfterToOngoingEventResponse>(`${API_BASE_URL}/transferToOngoingEvent/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in transferToOngoingEvent:', error);
      return ErrorMessage;
    }
  };

  static addUploadAdditionalLots = async (params: AddUploadAdditionalLotsParams): Promise<AddUploadAdditionalLotsResponse | string> => {
    try {
      const formData = new FormData();

      formData.append('file', params.file);
      formData.append('sellerId', params.sellerId.toString());
      formData.append('mineId', params.mineId.toString());
      formData.append('eventId', params.eventId.toString());
      formData.append('type', params.type);

      const res = await axiosFormData().post<AddUploadAdditionalLotsResponse>(`${API_BASE_URL}/uploadAdditionaLots`, formData);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in uploadAdditionaLots:', error);
      return ErrorMessage;
    }
  };

  static addSaveAdditionalLots = async (params: AddSaveAdditionalLotsParams): Promise<AddSaveAdditionalLotsResponse | string> => {
    try {
      const res = await axiosClient.post<AddSaveAdditionalLotsResponse>(`${API_BASE_URL}/saveAdditionaLots`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in saveAdditionaLots:', error);
      return ErrorMessage;
    }
  };

  static deleteUploadAdditionalLots = async (params: DeleteLotsParams): Promise<DeleteOngoingEventLotsResponse | string> => {
    try {
      const res = await axiosClient.post<DeleteOngoingEventLotsResponse>(`${API_BASE_URL}/deleteOngoingEventLots`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in deleteOngoingEventLots:', error);
      return ErrorMessage;
    }
  };

  static getStockDetailsForExport = async (params: UpdateGetStockDetailsForExportParams): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().get(`${API_BASE_URL}/getStockDetailsForExport`, {
        params: params,
        responseType: 'blob',
      });
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getStockDetailsForExport:', error);
      return null;
    }
  };

  static exportExcel = async (): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().get(`${API_BASE_URL}/downloadStoneDetailFile`, {
        responseType: 'blob',
      });
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in exportExcel:', error);
      return null;
    }
  };

  static importUploadStockDetails = async (params: AddUploadStockDetailsParams): Promise<ImportUploadStockDetailsResponse | string> => {
    try {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('eventId', params.eventId.toString());
      formData.append('seqNo', params.seqNo.toString());

      const res = await axiosFormData().post<ImportUploadStockDetailsResponse>(`${API_BASE_URL}/uploadStockDetail`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in uploadStockDetail:', error);
      return ErrorMessage;
    }
  };

  static getDownloadDemoLotsFile = async (eventCategory: string): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().get(`${API_BASE_URL}/downloadDemoLotsFile?eventCategory=${eventCategory}`, {
        responseType: 'blob',
      });
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in downloadDemoLotsFile:', error);
      return null;
    }
  };

  static uploadImage = async (params: UploadImagesParams): Promise<UploadImagesResponse | string> => {
    try {
      const formData = new FormData();
      params.file.forEach((element) => {
        formData.append('file', element);
      });
      formData.append('eventId', String(params.eventId));
      formData.append('lotNo', String(params.lotNo));
      formData.append('uploadType', params.uploadType);

      const res = await axiosFormData().post<UploadImagesResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/uploadImage`,
        formData
      );

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in uploadImage:', error);
      return ErrorMessage;
    }
  };

  static deleteImage = async (fileId: string): Promise<DeleteImageResponse | string> => {
    try {
      const res = await axiosClient.post<DeleteImageResponse>(`${API_BASE_URL}/deleteImage/${fileId}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in deleteImage:', error);
      return ErrorMessage;
    }
  };

  static fetchImages = async (eventId: number, lotNo: string): Promise<FetchImagesResponse | string> => {
    try {
      const res = await axiosClient.get<FetchImagesResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/getLotsImages?eventId=${eventId}&lotNo=${lotNo}`
      );
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getLotsImages:', error);
      return ErrorMessage;
    }
  };
}

import { HttpClient } from '@/lib/request';
import { IUser } from './_type';
import { getGeoAcceptLanguage } from '@/lib/utils';

// 第三方 API 客户端
const geoClient = new HttpClient({
  baseURL: 'https://nominatim.openstreetmap.org',
  timeout: 8000,
});

const adapterLocalFromCnCode = (countryCode: string) => {
  return getGeoAcceptLanguage(countryCode) || 'en';
};

export const getCoorAddress = (params: IUser.getCoorAddressRequest) => {
  return geoClient.get<IUser.getCoorAddressResponse>('/reverse', {
    format: 'json',
    zoom: 18,
    addressdetails: 1,
    ...params,
    'accept-language': adapterLocalFromCnCode(params['accept-language']),
  });
};

export const getSearchAddress = (params: IUser.getSearchAddressRequest) => {
  return geoClient.get<IUser.getSearchAddressResponse>('/search', {
    format: 'json',
    limit: 5,
    addressdetails: 1,
    ...params,
    'accept-language': adapterLocalFromCnCode(params['accept-language']),
  });
};

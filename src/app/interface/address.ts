export interface Addressinterface {
   _id?: string;
  label: 'Home' | 'Work' | 'Other';
  receiverName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}
export interface AddressResponse {
  success: boolean;

  message: string;

  data: Addressinterface;
}
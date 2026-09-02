export interface CheckoutData {

  addressId:
    | string
    | null;

  receiveType:
    | 'delivery'
    | 'pickup';

  paymentMethod:
    | 'cash'
    | 'aba'
    | 'card';

}
import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import { CheckoutData } from '../interface/checkout.interface';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl =
    'http://localhost:3000/api/orders';


  constructor(
    private http: HttpClient
  ) {}




  checkout(
    data: CheckoutData
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/checkout`,
      data
    );

  }
getKitchenOrders() {
  return this.http.get<any>(
    `${this.apiUrl}/kitchen`
  );
}


  getAllOrders(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/all`
    );

  }



  getMyOrders(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/my-orders`
    );

  }


  

  getOrderById(
    id: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );

  }



  cancelOrder(
    id: string
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );

  }


confirmOrder(
  orderId: string
): Observable<any> {

  return this.http.put<any>(
    `${this.apiUrl}/${orderId}/confirm`,
    {}
  );

}



startPreparing(
  orderId: string
): Observable<any> {

  return this.http.put<any>(
    `${this.apiUrl}/${orderId}/preparing`,
    {}
  );

}



markReady(orderId: string): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}/${orderId}/ready`,
    {}
  );

}
getDeliveryByOrder(
  orderId: string
): Observable<any> {

  return this.http.get<any>(
    `${this.apiUrl}/order/${orderId}`
  );

}
}
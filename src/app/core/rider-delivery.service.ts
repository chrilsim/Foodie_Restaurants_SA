import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../API_URL';
@Injectable({
    providedIn: 'root'
})
export class RiderDeliveryService {

  private apiUrl =
    `${API_URL}/delivery`;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET RIDERS
  // ==========================================

  getRiders():
    Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/riders`
    );

  }


  // ==========================================
  // ASSIGN RIDER
  // ==========================================

  assignRider(
    orderId: string,
    riderId: string
  ):
    Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/assign`,
      {
        orderId:
          orderId,

        riderId:
          riderId
      }
    );

  }


  getMyDeliveries():
    Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/my`
    );

  }


  acceptDelivery(
    deliveryId: string
  ):
    Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${deliveryId}/accept`,
      {}
    );

  }

  updateLocation(
    deliveryId: string,
    latitude: number,
    longitude: number
  ):
    Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${deliveryId}/location`,
      {
        latitude:latitude,
        longitude:longitude
      }
    );

  }

  // ==========================================
  // PICKUP
  // ==========================================

  pickupDelivery(
    deliveryId: string
  ):
    Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${deliveryId}/pickup`,
      {}
    );

  }
  startDelivery(
    deliveryId: string
  ):
    Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${deliveryId}/deliver`,
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

  completeDelivery(
    deliveryId: string
  ):
    Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${deliveryId}/complete`,
      {}
    );

  }

}
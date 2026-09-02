import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../API_URL';
@Injectable({
  providedIn: 'root'
})
export class BookingTableService {

  private apiUrl =`${API_URL}/bookingtable`;

  constructor(
    private http: HttpClient
  ) {}

  // ==========================================
  // CUSTOMER
  // ==========================================

  create(data: any): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );

  }


  getMyBookings(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/my`
    );

  }

getAllBookingsstaff(): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/all`
  );
}
  // ==========================================
  // ADMIN
  // ==========================================

  getAllBookings(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }


  getBookingById(
    id: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  updateStatus(
    id: string,
    status:
      | 'pending'
      | 'confirmed'
      | 'completed'
      | 'cancelled'
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}/status`,
      {
        status
      }
    );

  }


  deleteBooking(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }
cancelBooking(
  id: string
): Observable<any> {

  return this.http.put(
    `${this.apiUrl}/${id}/cancel`,
    {}
  );

}
}
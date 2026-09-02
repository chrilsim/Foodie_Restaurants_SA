import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  private apiUrl =
    'http://localhost:3000/api/notifications';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET ALL
  // ==========================================

  getNotifications(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }


  // ==========================================
  // GET UNREAD COUNT
  // ==========================================

  getUnreadCount(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/unread-count`
    );

  }


  // ==========================================
  // CREATE
  // ==========================================

  createNotification(
    data: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );

  }


  // ==========================================
  // MARK ONE READ
  // ==========================================

  markAsRead(
    id: string
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}/read`,
      {}
    );

  }


  // ==========================================
  // MARK ALL READ
  // ==========================================

  markAllAsRead(): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/read-all`,
      {}
    );

  }


  // ==========================================
  // DELETE ONE
  // ==========================================

  deleteNotification(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // DELETE ALL
  // ==========================================

  deleteAllNotifications(): Observable<any> {

    return this.http.delete(
      this.apiUrl
    );

  }

}
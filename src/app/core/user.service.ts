import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../API_URL';
export interface User {
  _id?: string;

  fullName: string;

  email: string;

  role: 'Admin' | 'Customer' | 'Rider' | 'Staff';

  gender?: string | null;

  phone?: string | null;

  jobRole?: string | null;

  salary?: number | null;

  createdAt?: string;

  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl =
    `${API_URL}/users`;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET ALL USERS
  // ==========================================

  getUsers(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }


  // ==========================================
  // GET CUSTOMERS
  // ==========================================

  getCustomers(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/customers`
    );

  }


  // ==========================================
  // GET STAFF
  // ==========================================

  getStaff(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/staff`
    );

  }


  // ==========================================
  // GET USER BY ID
  // ==========================================

  getUser(
    id: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // ADD USER
  // ==========================================

  createUser(
    data: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );

  }


  // ==========================================
  // UPDATE USER
  // ==========================================

  updateUser(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );

  }


  // ==========================================
  // DELETE USER
  // ==========================================

  deleteUser(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}
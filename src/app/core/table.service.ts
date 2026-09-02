import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../API_URL';
export interface Table {

  _id?: string;

  tableNumber: string;

  seats: number;

  area: string;

  status:
    | 'available'
    | 'occupied'
    | 'maintenance';

  createdAt?: string;

  updatedAt?: string;

}


@Injectable({
  providedIn: 'root'
})


export class TableService {

  private apiUrl =
   `${API_URL}/tables`;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET ALL TABLES
  // ==========================================

  getTables(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }


  // ==========================================
  // GET TABLE BY ID
  // ==========================================

  getTable(
    id: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // CREATE TABLE
  // ==========================================

  createTable(
    data: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );

  }


  // ==========================================
  // UPDATE TABLE
  // ==========================================

  updateTable(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );

  }


  // ==========================================
  // DELETE TABLE
  // ==========================================

  deleteTable(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}
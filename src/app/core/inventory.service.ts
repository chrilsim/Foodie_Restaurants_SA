import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {


  // ==========================================
  // API URL
  // ==========================================

  private apiUrl =
    'http://localhost:3000/api/inventory';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET ALL INVENTORY
  // GET /api/inventory
  // ==========================================

  getItems(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }


  // ==========================================
  // GET ONE ITEM
  // GET /api/inventory/:id
  // ==========================================

  getItem(
    id: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // GET STATISTICS
  // GET /api/inventory/statistics
  // ==========================================

  getStatistics(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/statistics`
    );

  }


  // ==========================================
  // CREATE ITEM
  // POST /api/inventory
  // ==========================================

  createItem(
    data: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );

  }


  // ==========================================
  // UPDATE ITEM
  // PUT /api/inventory/:id
  // ==========================================

  updateItem(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );

  }


  // ==========================================
  // DELETE ITEM
  // DELETE /api/inventory/:id
  // ==========================================

  deleteItem(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // STOCK IN
  // POST /api/inventory/:id/stock-in
  // ==========================================

  stockIn(
    id: string,
    quantity: number,
    reason: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/${id}/stock-in`,
      {
        quantity,
        reason
      }
    );

  }


  // ==========================================
  // STOCK OUT
  // POST /api/inventory/:id/stock-out
  // ==========================================

  stockOut(
    id: string,
    quantity: number,
    reason: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/${id}/stock-out`,
      {
        quantity,
        reason
      }
    );

  }


  // ==========================================
  // STOCK HISTORY
  // GET /api/inventory/:id/history
  // ==========================================

  getStockHistory(
    id: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}/history`
    );

  }

}
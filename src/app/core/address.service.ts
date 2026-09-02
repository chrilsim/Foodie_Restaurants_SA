import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Addressinterface,AddressResponse } from '../interface/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = 'http://localhost:3000/api/addresses';

  constructor(private http: HttpClient) {}

  // GET my addresses
  getAddresses(): Observable<Addressinterface[]> {
    return this.http.get<Addressinterface[]>(this.apiUrl);
  }

  // GET one address
  getAddress(id: string): Observable<Addressinterface> {
    return this.http.get<Addressinterface>(
      `${this.apiUrl}/${id}`
    );
  }

  // POST create address
createAddress(
  data: Addressinterface
): Observable<AddressResponse> {

  return this.http.post<AddressResponse>(
    this.apiUrl,
    data
  );
}

  // PUT update address
  updateAddress(
    id: string,
    data: Addressinterface
  ): Observable<Addressinterface> {
    return this.http.put<Addressinterface>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // DELETE address
  deleteAddress(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}
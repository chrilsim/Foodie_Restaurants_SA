import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staff } from '../interface/staff.interface';
@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private apiUrl = 'http://localhost:3000/api/staff';

  constructor(private http: HttpClient) {}


  // GET ALL STAFF

  getAllStaff(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  // GET STAFF BY ID

  getStaffById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


  // ADD STAFF

  createStaff(staff: Staff): Observable<any> {
    return this.http.post(
      this.apiUrl,
      staff
    );
  }


  // UPDATE STAFF

  updateStaff(
    id: string,
    staff: Partial<Staff>
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      staff
    );
  }


  // DELETE STAFF

  deleteStaff(id: string): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}
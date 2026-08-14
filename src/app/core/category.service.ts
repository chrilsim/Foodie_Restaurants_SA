import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';
import { map } from 'rxjs';
import { interfaceCategory } from '../interface/category';


@Injectable({
  providedIn: 'root'
})
export class categoryService {
     private apiUrl = "http://localhost:3000/api/category";


  private categorySource = new BehaviorSubject<interfaceCategory[]>([]);
  category$ = this.categorySource.asObservable();

  constructor(private http: HttpClient) { }


  getCategory() {
    return this.http.get<interfaceCategory[]>(this.apiUrl).pipe(
      tap(data => this.categorySource.next(data))
    );
  }
}
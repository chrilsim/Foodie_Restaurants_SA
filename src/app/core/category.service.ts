import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import { tap } from 'rxjs/operators';

import { interfaceCategory }
  from '../interface/category';


@Injectable({
  providedIn: 'root'
})
export class categoryService {

  private apiUrl =
    'http://localhost:3000/api/category';


  private categorySource =
    new BehaviorSubject<
      interfaceCategory[]
    >([]);


  category$ =
    this.categorySource.asObservable();


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET
  // ==========================================

  getCategory():
    Observable<interfaceCategory[]> {

    return this.http
      .get<interfaceCategory[]>(
        this.apiUrl
      )
      .pipe(

        tap(data => {

          this.categorySource.next(
            data || []
          );

        })

      );

  }


  // ==========================================
  // CREATE
  // ==========================================

  createCategory(
    data: interfaceCategory
  ): Observable<interfaceCategory> {

    return this.http
      .post<interfaceCategory>(
        this.apiUrl,
        data
      )
      .pipe(

        tap(() => {

          this.getCategory()
            .subscribe();

        })

      );

  }


  // ==========================================
  // UPDATE
  // ==========================================

  updateCategory(
    id: string,
    data: interfaceCategory
  ): Observable<interfaceCategory> {

    return this.http
      .put<interfaceCategory>(
        `${this.apiUrl}/${id}`,
        data
      )
      .pipe(

        tap(() => {

          this.getCategory()
            .subscribe();

        })

      );

  }


  // ==========================================
  // DELETE
  // ==========================================

  deleteCategory(
    id: string
  ): Observable<any> {

    return this.http
      .delete(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        tap(() => {

          this.getCategory()
            .subscribe();

        })

      );

  }

}
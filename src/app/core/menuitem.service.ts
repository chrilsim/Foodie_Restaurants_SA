import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { interfaceitemenu } from '../interface/menuitem';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'http://localhost:3000/api/menuitems';

  // =====================================================
  // STATE
  // =====================================================

  private menuitemSource =
    new BehaviorSubject<interfaceitemenu[]>([]);

  menuitem$ =
    this.menuitemSource.asObservable();


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GET ALL MENU ITEMS
  // =====================================================

  getMenuItems(): Observable<interfaceitemenu[]> {

    return this.http
      .get<interfaceitemenu[]>(this.apiUrl)
      .pipe(

        tap(data => {

          this.menuitemSource.next(data);

        })

      );

  }

getMenuItemsPagination(
  page: number = 1,
  limit: number = 10
) {

  const params = {

    page: page.toString(),

    limit: limit.toString()

  };


  return this.http.get<any>(
    `${this.apiUrl}/pagination`,
    {
      params
    }
  );

}
  // =====================================================
  // GET ONE MENU ITEM
  // =====================================================

  getMenuItem(
    id: string
  ): Observable<interfaceitemenu> {

    return this.http
      .get<interfaceitemenu>(
        `${this.apiUrl}/${id}`
      );

  }


  // =====================================================
  // CREATE
  // =====================================================

  create(
    menuitem: FormData
  ): Observable<interfaceitemenu> {

    return this.http
      .post<interfaceitemenu>(
        this.apiUrl,
        menuitem
      )
      .pipe(

        tap(newMenuitem => {

          const current =
            this.menuitemSource.value;

          this.menuitemSource.next([

            newMenuitem,

            ...current

          ]);

        })

      );

  }


  // =====================================================
  // UPDATE
  // =====================================================

  update(
    id: string,
    menuitem: FormData
  ): Observable<interfaceitemenu> {

    return this.http
      .put<interfaceitemenu>(
        `${this.apiUrl}/${id}`,
        menuitem
      )
      .pipe(

        tap(updatedItem => {

          const current =
            this.menuitemSource.value;


          const updatedList =
            current.map(item =>

              item._id === id

                ? updatedItem

                : item

            );


          this.menuitemSource.next(
            updatedList
          );

        })

      );

  }


  // =====================================================
  // UPDATE AVAILABILITY
  // =====================================================

  updateAvailability(
    id: string,
    isAvailable: boolean
  ): Observable<interfaceitemenu> {

    const formData =
      new FormData();


    formData.append(
      'isAvailable',
      String(isAvailable)
    );


    return this.http
      .put<interfaceitemenu>(
        `${this.apiUrl}/${id}`,
        formData
      )
      .pipe(

        tap(updatedItem => {

          const current =
            this.menuitemSource.value;


          const updatedList =
            current.map(item =>

              item._id === id

                ? {
                    ...item,
                    isAvailable:
                      updatedItem.isAvailable
                  }

                : item

            );


          this.menuitemSource.next(
            updatedList
          );

        })

      );

  }


  // =====================================================
  // DELETE
  // =====================================================

  delete(
    id: string
  ) {

    return this.http
      .delete<{
        message: string;
        menuitem: interfaceitemenu;
      }>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        tap(() => {

          const current =
            this.menuitemSource.value;


          const updatedList =
            current.filter(
              item =>
                item._id !== id
            );


          this.menuitemSource.next(
            updatedList
          );

        })

      );

  }


  // =====================================================
  // CLEAR STATE
  // =====================================================

  clearMenuItems(): void {

    this.menuitemSource.next([]);

  }

}
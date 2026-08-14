import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';
import { map } from 'rxjs';
import { interfaceitemenu } from '../interface/menuitem';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = "http://localhost:3000/api/menuitems";


  private menuitemSource = new BehaviorSubject<interfaceitemenu[]>([]);
  menuitem$ = this.menuitemSource.asObservable();

  constructor(private http: HttpClient) { }


  getMenuItems() {
    return this.http.get<interfaceitemenu[]>(this.apiUrl).pipe(
      tap(data => this.menuitemSource.next(data))
    );
  }
  create(menuitem: FormData) {
    return this.http.post<interfaceitemenu>(
      this.apiUrl,
      menuitem
    ).pipe(
      tap(newMenuitem => {
        const current = this.menuitemSource.value;

        this.menuitemSource.next([
          ...current,
          newMenuitem
        ]);
      })
    );
  }
  update(id: string, menuitem: FormData) {
    return this.http.put<interfaceitemenu>(
      `${this.apiUrl}/${id}`,
      menuitem
    ).pipe(
      tap(updatedItem => {
        const current = this.menuitemSource.value;
        const updatedList = current.map(item =>
          item._id === id
            ? updatedItem
            : item
        );

        this.menuitemSource.next(updatedList);
      })
    );
  }
  
  delete(id: string) {
  return this.http.delete(
    `${this.apiUrl}/${id}`
  );
}

  updateAvailability(id: string, isAvailable: boolean) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      { isAvailable }
    );
  }
}
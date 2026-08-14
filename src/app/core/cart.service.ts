import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DrawerType = 'cart' | 'menu' | null;

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  private drawerSubject = new BehaviorSubject<DrawerType>(null);

 drawer$ = this.drawerSubject.asObservable();

  open(type: 'menu' | 'cart') {
    this.drawerSubject.next(type);
  }

  close() {
    this.drawerSubject.next(null);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { API_URL } from '../API_URL';
interface RegisterData {

  fullName: string;

  phone: string;

  email: string;

  password: string;

}

interface LoginData {

  identifier: string;

  password: string;

}


interface LoginResponse {

  success: boolean;

  message: string;

  token: string;

  user: {

    id: string;

    fullName: string;

    phone: string;

    email: string;

    role: string;

  };

}


@Injectable({
  providedIn: 'root'
})


export class AuthService {


  private apiUrl =`${API_URL}/auth`;


  constructor(
    private http: HttpClient
  ) {}



  register(
    data: RegisterData
  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/register`,

      data

    );

  }
  login(
    data: LoginData
  ): Observable<LoginResponse> {

    return this.http

      .post<LoginResponse>(

        `${this.apiUrl}/login`,

        data

      )

      .pipe(

        tap((response) => {

          localStorage.setItem(

            'token',

            response.token

          );


          // ================================
          // SAVE USER
          // ================================

          localStorage.setItem(

            'user',

            JSON.stringify(
              response.user
            )

          );

        })

      );

  }


  // ==========================================
  // GET TOKEN
  // ==========================================

  getToken(): string | null {

    return localStorage.getItem(
      'token'
    );

  }


  // ==========================================
  // GET USER
  // ==========================================

  getUser(): any {

    const user =
      localStorage.getItem(
        'user'
      );

    return user
      ? JSON.parse(user)
      : null;

  }


  // ==========================================
  // CHECK LOGIN
  // ==========================================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

  }

}
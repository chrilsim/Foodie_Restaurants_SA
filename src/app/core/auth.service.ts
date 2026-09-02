import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


// ==========================================
// REGISTER DATA
// ==========================================

interface RegisterData {

  fullName: string;

  phone: string;

  email: string;

  password: string;

}


// ==========================================
// LOGIN DATA
// ==========================================

interface LoginData {

  identifier: string;

  password: string;

}


// ==========================================
// LOGIN RESPONSE
// ==========================================

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


  private apiUrl =
    'http://localhost:3000/api/auth';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // REGISTER
  // ==========================================

  register(
    data: RegisterData
  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/register`,

      data

    );

  }


  // ==========================================
  // LOGIN
  // EMAIL OR PHONE
  // ==========================================

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


          // ================================
          // SAVE TOKEN
          // ================================

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
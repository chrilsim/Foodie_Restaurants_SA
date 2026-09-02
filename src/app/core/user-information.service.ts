import { Injectable } from '@angular/core';

import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';


export interface UserInformation {

    _id: string;

    fullName: string;

    email: string;

    phone: string | null;

    gender: string | null;

    role: string;

    jobRole: string | null;

    salary: number | null;

    createdAt: string;

    updatedAt: string;

}


export interface UserResponse {

    success: boolean;

    message?: string;

    data: UserInformation;

}


@Injectable({
    providedIn: 'root'
})


export class UserInformationService {


    private apiUrl =
        'http://localhost:3000/api/users';


    constructor(
        private http: HttpClient
    ) { }


    // ==========================================
    // GET MY PROFILE
    // ==========================================

    getMyInformation():
        Observable<UserResponse> {

        const token =
            localStorage.getItem(
                'token'
            );


        const headers =
            new HttpHeaders({

                Authorization:
                    `Bearer ${token}`

            });


        return this.http.get<UserResponse>(

            `${this.apiUrl}/me`,

            {
                headers
            }

        );

    }
    changePassword(data: {

        currentPassword: string;

        newPassword: string;

        confirmPassword: string;

    }): Observable<any> {

        const token =
            localStorage.getItem('token');


        const headers =
            new HttpHeaders({

                Authorization:
                    `Bearer ${token}`

            });


        return this.http.put(

            `${this.apiUrl}/me/password`,

            data,

            {
                headers
            }

        );

    }

    // ==========================================
    // UPDATE MY PROFILE
    // ==========================================

    updateMyInformation(
        data: {
            fullName: string;
            email: string;
            phone: string;
            gender: string;
        }
    ):
        Observable<UserResponse> {

        const token =
            localStorage.getItem(
                'token'
            );


        const headers =
            new HttpHeaders({

                Authorization:
                    `Bearer ${token}`

            });


        return this.http.put<UserResponse>(

            `${this.apiUrl}/me`,

            data,

            {
                headers
            }

        );

    }

}
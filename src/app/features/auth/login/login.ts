import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { FormsModule } from '@angular/forms';

import { AddToCartService } from '../../../core/addToCart.service';


@Component({
  selector: 'app-login',

  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    FormsModule
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'
})


export class Login {



  identifier: string = '';

  password: string = '';


  hidePassword = true;


  constructor(

    private authService: AuthService,

    private router: Router,

    private cartservice: AddToCartService

  ) {}


  login(): void {


    if (
      !this.identifier.trim() ||
      !this.password
    ) {

      alert(
        'សូមបញ្ចូល Email ឬ លេខទូរស័ព្ទ និង Password'
      );

      return;

    }

    const loginData = {

      identifier:
        this.identifier.trim(),

      password:
        this.password

    };


    this.authService
      .login(loginData)

      .subscribe({

        next: (response) => {

          this.cartservice
            .mergeGuestCart()

            .subscribe({

              next: (mergeResponse) => {

                console.log(
                  'GUEST CART MERGED:',
                  mergeResponse
                );

              },


              error: (err) => {

                console.error(
                  'MERGE CART ERROR:',
                  err
                );

              },


              complete: () => {

                this.cartservice.loadCart();
                if (response.user.role ==='Admin') {
                  this.router.navigate(['/main-dashboard/dashboard']);
                }
                else if (response.user.role ==='Rider') {
                  this.router.navigate(['/rider']);
                }
                else {

                  this.router.navigate([
                    '/'
                  ]);

                }

              }

            });

        },


        error: (error) => {

          console.error(
            'Login Error:',
            error
          );


          alert(

            error.error?.message ||

            'Email ឬ លេខទូរស័ព្ទ ឬ Password មិនត្រឹមត្រូវ'

          );

        }

      });

  }

}
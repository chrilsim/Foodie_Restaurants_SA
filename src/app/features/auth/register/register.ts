import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { RouterLink, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/auth.service';


@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],

  templateUrl: './register.html',

  styleUrl: './register.css'
})


export class Register {



  fullName = '';

  phone = '';

  email = '';

  password = '';

  confirmPassword = '';


  hidePassword = true;

  hideConfirmPassword = true;


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  register(): void {

    if (
      !this.fullName.trim() ||
      !this.phone.trim() ||
      !this.email.trim() ||
      !this.password
    ) {

      alert(
        'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់'
      );

      return;

    }

    if (
      this.password !==
      this.confirmPassword
    ) {

      alert(
        'ពាក្យសម្ងាត់មិនដូចគ្នា'
      );

      return;

    }

    const userData = {

      fullName:
        this.fullName.trim(),

      phone:
        this.phone.trim(),

      email:this.email.trim().toLowerCase(),
      password:this.password
    };
    this.authService.register(userData).subscribe({
        next: (res) => {
          alert('ចុះឈ្មោះបានជោគជ័យ');

          this.router.navigate(['/login']);

        },


        error: (err) => {

          console.error(
            'REGISTER ERROR:',
            err
          );

          alert(
            err.error?.message ||
            'ចុះឈ្មោះមិនបានជោគជ័យ'
          );

        }

      });

  }

}


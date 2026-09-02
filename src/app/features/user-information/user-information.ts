import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  UserInformationService,
  UserInformation
} from '../../core/user-information.service';


@Component({

  selector:
    'app-user-information',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    MatIconModule,

    MatButtonModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule

  ],

  templateUrl:
    './user-information.html',

  styleUrl:
    './user-information.css'

})


export class UserInformationComponent implements OnInit {
  user: UserInformation | null = null;

  fullName = '';

  email = '';

  phone = '';

  gender = '';
  showPasswordSection = false;

  currentPassword = '';

  newPassword = '';

  confirmPassword = '';

  isChangingPassword = false;

  isLoading = false;

  isSaving = false;

  isEditing = false;


  constructor(
    private userService:
      UserInformationService,
    private drc: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.loadUser();

  }


  loadUser(): void {

    this.isLoading = true;


    this.userService
      .getMyInformation()

      .subscribe({

        next: (response) => {

          this.user =
            response.data;


          this.setFormData(
            response.data
          );


          this.isLoading = false;
          this.drc.detectChanges();

        },


        error: (error) => {

          console.error(
            'GET USER ERROR:',
            error
          );


          this.isLoading = false;
          this.drc.detectChanges();

          alert(
            error.error?.message ||
            'Failed to load user information'
          );

        }

      });

  }
  changePassword(): void {

    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmPassword
    ) {

      alert(
        'សូមបំពេញព័ត៌មាន Password ឱ្យបានគ្រប់'
      );

      return;

    }


    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      alert(
        'New Password និង Confirm Password មិនដូចគ្នា'
      );

      return;

    }


    if (
      this.newPassword.length < 6
    ) {

      alert(
        'Password ត្រូវមានយ៉ាងតិច 6 តួ'
      );

      return;

    }


    this.isChangingPassword = true;


    this.userService

      .changePassword({

        currentPassword:
          this.currentPassword,

        newPassword:
          this.newPassword,

        confirmPassword:
          this.confirmPassword

      })

      .subscribe({

        next: (response) => {

          this.isChangingPassword =
            false;


          this.currentPassword =
            '';

          this.newPassword =
            '';

          this.confirmPassword =
            '';


          this.showPasswordSection =
            false;


          alert(
            'Password changed successfully'
          );

        },


        error: (error) => {

          console.error(
            'CHANGE PASSWORD ERROR:',
            error
          );


          this.isChangingPassword =
            false;


          alert(

            error.error?.message ||

            'Failed to change password'

          );

        }

      });

  }

  setFormData(
    user: UserInformation
  ): void {

    this.fullName =
      user.fullName || '';

    this.email =
      user.email || '';

    this.phone =
      user.phone || '';

    this.gender =
      user.gender || '';

  }


  editProfile(): void {

    this.isEditing = true;

  }

  cancelEdit(): void {

    if (this.user) {

      this.setFormData(
        this.user
      );

    }

    this.isEditing = false;

  }

  saveProfile(): void {


    if (!this.fullName.trim()) {

      alert(
        'សូមបញ្ចូលឈ្មោះ'
      );

      return;

    }


    if (!this.email.trim()) {

      alert(
        'សូមបញ្ចូល Email'
      );

      return;

    }


    this.isSaving = true;


    const data = {

      fullName:
        this.fullName.trim(),

      email:
        this.email.trim().toLowerCase(),

      phone:
        this.phone.trim(),

      gender:
        this.gender

    };


    this.userService

      .updateMyInformation(data)

      .subscribe({

        next: (response) => {

          console.log(
            'PROFILE UPDATED:',
            response
          );


          this.user =
            response.data;


          this.setFormData(
            response.data
          );
          const oldUser =
            localStorage.getItem(
              'user'
            );


          let localUser: any = {};


          if (oldUser) {

            try {

              localUser =
                JSON.parse(oldUser);

            }

            catch {

              localUser = {};

            }

          }


          localStorage.setItem('user', JSON.stringify({
            ...localUser,
            id: response.data._id,
            fullName: response.data.fullName,
            email: response.data.email,
            phone: response.data.phone,
            role: response.data.role
          })

          );
          this.isSaving = false;
          this.isEditing = false;
          this.drc.detectChanges();
          alert('Profile updated successfully');

        },


        error: (error) => {

          console.error(
            'UPDATE PROFILE ERROR:',
            error
          );


          this.isSaving = false;
          this.drc.detectChanges();

          alert(

            error.error?.message ||

            'Failed to update profile'

          );

        }

      });

  }

}
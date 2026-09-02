import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

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
  UserService,
  User
} from '../../../core/user.service';


@Component({
  selector: 'app-user-management',

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
    './user-management.html',

  styleUrl:
    './user-management.css'
})


export class UserManagement implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];

  searchText = '';

  selectedRole ='All';

  isLoading = false;
  showModal = false;
  isEditMode = false;
  editingId: string | null = null;

  form = {

    fullName: '',

    email: '',

    password: '',

    role: 'Customer',

    gender: '',

    phone: '',

    jobRole: '',

    salary: null as number | null

  };


  constructor(
    private userService: UserService,
    private drc:ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.loadUsers();

  }
  loadUsers(): void {

    this.isLoading = true;


    this.userService
      .getUsers()
      .subscribe({

        next: (res) => {

          this.users =
            res.data || [];

          this.applyFilter();

          this.isLoading = false;
          this.drc.detectChanges();

        },

        error: (err) => {

          console.error(
            'GET USERS ERROR:',
            err
          );

          this.isLoading = false;
           this.drc.detectChanges();
        }

      });

  }
  get totalUsers(): number {

    return this.users.length;

  }
  getUserCount(role: string): number {
    return this.users.filter(
      user => user.role === role
    ).length;

  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }


  resetFilter(): void {
    this.searchText = '';
    this.selectedRole = 'All';

    this.applyFilter();

  }

  applyFilter(): void {

    const search =
      this.searchText.toLowerCase().trim();
    this.filteredUsers =
      this.users.filter(user => {
        const matchSearch =
          user.fullName
            .toLowerCase()
            .includes(search)
          ||

          user.email
            .toLowerCase()
            .includes(search)

          ||

          (user.phone || '')
            .toLowerCase()
            .includes(search);


        const matchRole =

          this.selectedRole === 'All'

          ||

          user.role ===
          this.selectedRole;


        return (
          matchSearch &&
          matchRole
        );

      });

  }

  openAdd(): void {

    this.isEditMode = false;

    this.editingId = null;

    this.resetForm();

    this.showModal = true;

  }
  openEdit(user: User): void {

    this.isEditMode = true;

    this.editingId =
      user._id || null;


    this.form = {

      fullName:
        user.fullName,

      email:
        user.email,

      password: '',

      role:
        user.role,

      gender:
        user.gender || '',

      phone:
        user.phone || '',

      jobRole:
        user.jobRole || '',

      salary:
        user.salary ?? null

    };


    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  resetForm(): void {

    this.form = {

      fullName: '',

      email: '',

      password: '',

      role: 'Customer',

      gender: '',

      phone: '',

      jobRole: '',

      salary: null

    };

  }


  saveUser(): void {

    if (
      !this.form.fullName ||
      !this.form.email
    ) {

      alert(
        'Please fill required fields'
      );

      return;

    }


    if (!this.isEditMode) {

      if (!this.form.password) {

        alert(
          'Password is required'
        );

        return;

      }


      const data: any = {

        fullName:
          this.form.fullName,

        email:
          this.form.email,

        password:
          this.form.password,

        role:
          this.form.role

      };


      if (
        this.form.role === 'Staff'
      ) {

        data.gender =
          this.form.gender;

        data.phone =
          this.form.phone;

        data.jobRole =
          this.form.jobRole;

        data.salary =
          this.form.salary;

      }


      this.userService
        .createUser(data)
        .subscribe({

          next: (res) => {

            console.log(
              'CREATE USER:',
              res
            );

            this.closeModal();

            this.loadUsers();

          },

          error: (err) => {

            console.error(
              'CREATE USER ERROR:',
              err
            );


            if (err.status === 409) {

              alert(
                err.error?.message ||
                'Email already exists'
              );

              return;

            }


            alert(
              err.error?.message ||
              'Failed to create user'
            );

          }

        });

    }

    else {

      if (!this.editingId) {
        return;
      }


      const data: any = {

        fullName:
          this.form.fullName,

        email:
          this.form.email,

        role:
          this.form.role

      };


      if (
        this.form.role === 'Staff'
      ) {

        data.gender =
          this.form.gender;

        data.phone =
          this.form.phone;

        data.jobRole =
          this.form.jobRole;

        data.salary =
          this.form.salary;

      }


      this.userService
        .updateUser(
          this.editingId,
          data
        )
        .subscribe({

          next: (res) => {

            console.log(
              'UPDATE USER:',
              res
            );

            this.closeModal();

            this.loadUsers();

          },

          error: (err) => {

            console.error(
              'UPDATE USER ERROR:',
              err
            );

            alert(
              err.error?.message ||
              'Failed to update user'
            );

          }

        });

    }

  }

  deleteUser(
    user: User
  ): void {

    if (!user._id) {
      return;
    }


    if (user.role === 'Admin') {

      alert(
        'Admin cannot be deleted'
      );

      return;

    }


    const confirmDelete =
      confirm(
        `Delete ${user.fullName}?`
      );


    if (!confirmDelete) {
      return;
    }


    this.userService
      .deleteUser(user._id)
      .subscribe({

        next: () => {

          this.loadUsers();

        },

        error: (err) => {

          console.error(
            'DELETE USER ERROR:',
            err
          );

          alert(
            err.error?.message ||
            'Failed to delete user'
          );

        }

      });

  }


  onRoleChange(): void {

    if (
      this.form.role !== 'Staff'
    ) {

      this.form.gender = '';

      this.form.phone = '';

      this.form.jobRole = '';

      this.form.salary = null;

    }

  }

}
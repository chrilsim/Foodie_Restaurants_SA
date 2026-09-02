import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StaffService } from '../../../core/staff.service';
import { Staff } from '../../../interface/staff.interface';
@Component({
  selector: 'app-staff-management',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],

  templateUrl: './staff-management.html',
  styleUrl: './staff-management.css'
})
export class StaffManagementComponent implements OnInit {

  staffs: Staff[] = [];
  filteredStaffs: Staff[] = [];

  searchText = '';
  isLoading = false;
  showForm = false;

  isEditMode = false;

  selectedStaffId: string | null = null;


  staffForm: Staff = {

    name: '',

    gender: '',

    phone: '',

    email: '',

    role: '',

    salary: 0

  };

  roles = [

    'Manager',

    'Cashier',

    'Kitchen',

    'Waiter'

  ];


  constructor(
    private staffService: StaffService
  ) {}

  ngOnInit(): void {

    this.loadStaff();

  }

  loadStaff(): void {

    this.isLoading = true;

    this.staffService.getAllStaff()
      .subscribe({

        next: (response) => {

          this.staffs = response.data || [];
          this.filteredStaffs = [
            ...this.staffs
          ];

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'Failed to load staff:',
            error
          );

          this.isLoading = false;

          alert(
            error.error?.message ||
            'Failed to load staff'
          );

        }

      });

  }

  searchStaff(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    if (!search) {

      this.filteredStaffs = [
        ...this.staffs
      ];

      return;

    }


    this.filteredStaffs =
      this.staffs.filter(staff =>

        staff.name
          .toLowerCase()
          .includes(search)

        ||

        staff.email
          .toLowerCase()
          .includes(search)

        ||

        staff.phone
          .toLowerCase()
          .includes(search)

        ||

        staff.role
          .toLowerCase()
          .includes(search)

      );

  }
  openAddForm(): void {

    this.isEditMode = false;

    this.selectedStaffId = null;

    this.staffForm = {

      name: '',

      gender: '',

      phone: '',

      email: '',

      role: '',

      salary: 0

    };

    this.showForm = true;

  }

  openEditForm(staff: Staff): void {

    this.isEditMode = true;

    this.selectedStaffId =
      staff._id || null;


    this.staffForm = {

      name: staff.name,

      gender: staff.gender,

      phone: staff.phone,

      email: staff.email,

      role: staff.role,

      salary: staff.salary

    };


    this.showForm = true;

  }

  closeForm(): void {

    this.showForm = false;

    this.isEditMode = false;

    this.selectedStaffId = null;

  }

  saveStaff(): void {

    if (

      !this.staffForm.name.trim() ||

      !this.staffForm.gender ||

      !this.staffForm.phone.trim() ||

      !this.staffForm.email.trim() ||

      !this.staffForm.role ||

      this.staffForm.salary < 0

    ) {

      alert(
        'Please fill in all fields correctly'
      );

      return;

    }

    if (
      this.isEditMode &&
      this.selectedStaffId
    ) {

      this.staffService
        .updateStaff(
          this.selectedStaffId,
          this.staffForm
        )
        .subscribe({

          next: (response) => {

            alert(
              response.message ||
              'Staff updated successfully'
            );

            this.closeForm();

            this.loadStaff();

          },

          error: (error) => {

            console.error(error);

            alert(
              error.error?.message ||
              'Failed to update staff'
            );

          }

        });

      return;

    }

    this.staffService.createStaff(this.staffForm).subscribe({

        next: (response) => {

          alert(
            response.message ||
            'Staff created successfully'
          );

          this.closeForm();

          this.loadStaff();

        },

        error: (error) => {

          console.error(error);

          alert(
            error.error?.message ||
            'Failed to create staff'
          );

        }

      });

  }

  deleteStaff(staff: Staff): void {

    if (!staff._id) {

      return;

    }


    const confirmDelete =
      confirm(
        `Are you sure you want to delete ${staff.name}?`
      );


    if (!confirmDelete) {

      return;

    }


    this.staffService
      .deleteStaff(staff._id)
      .subscribe({

        next: (response) => {

          alert(
            response.message ||
            'Staff deleted successfully'
          );

          this.loadStaff();

        },

        error: (error) => {

          console.error(error);

          alert(
            error.error?.message ||
            'Failed to delete staff'
          );

        }

      });

  }

}
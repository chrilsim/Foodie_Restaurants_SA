import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import {
  TableService,
  Table
} from '../../../core/table.service';


@Component({

  selector:
    'app-table-management',

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

   templateUrl: './table-managerment.html',
  styleUrl: './table-managerment.css',

})


export class TableManagement implements OnInit {

  tables: Table[] = [];

  filteredTables: Table[] = [];
  searchText = '';
  selectedStatus = 'All';
  isLoading = false;

  showModal = false;

  isEditMode = false;

  editingId: string | null = null;

  form = {
    tableNumber: '',
    seats: null as number | null,
    area: '',
    status:'available'

  };


  constructor(
    private tableService: TableService,
    private drc:ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadTables();

  }

  loadTables(): void {

    this.isLoading = true;
    this.tableService.getTables().subscribe({

        next: (res) => {

          this.tables =
            res.data || [];

          this.applyFilter();
          this.isLoading = false;
          this.drc.detectChanges();

        },

        error: (err) => {

          console.error(
            'GET TABLES ERROR:',
            err
          );

          this.isLoading = false;
          this.drc.detectChanges();
        }

      });

  }

get totalTables(): number {
  return this.tables.length;
}

getTableCount(status: string): number {

  return this.tables.filter(
    table => table.status === status
  ).length;

}
clearSearch(): void {

  this.searchText = '';

  this.applyFilter();

}


resetFilter(): void {

  this.searchText = '';

  this.selectedStatus = 'All';

  this.applyFilter();

}

  applyFilter(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    this.filteredTables =
      this.tables.filter(
        table => {


          const matchSearch =

            table.tableNumber
              .toLowerCase()
              .includes(search)

            ||

            table.area
              .toLowerCase()
              .includes(search);


          const matchStatus =

            this.selectedStatus ===
              'All'

            ||

            table.status ===
              this.selectedStatus;


          return (
            matchSearch &&
            matchStatus
          );

        }
      );

  }


  openAdd(): void {

    this.isEditMode = false;

    this.editingId = null;

    this.resetForm();

    this.showModal = true;

  }


  openEdit(table: Table): void {
    this.isEditMode = true;
    this.editingId =table._id || null;
    this.form = {

      tableNumber:
        table.tableNumber,

      seats:
        table.seats,

      area:
        table.area,

      status:
        table.status

    };


    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }


  resetForm(): void {

    this.form = {

      tableNumber: '',

      seats: null,

      area: '',

      status:
        'available'

    };

  }


  saveTable(): void {
    if (
      !this.form.tableNumber ||
      !this.form.seats ||
      !this.form.area
    ) {

      alert(
        'Please fill all required fields'
      );

      return;

    }


    const data = {

      tableNumber:
        this.form.tableNumber.trim(),

      seats:
        Number(this.form.seats),

      area:
        this.form.area.trim(),

      status:
        this.form.status

    };

    if (!this.isEditMode) {

      this.tableService.createTable(data).subscribe({
          next: (res) => {
            alert('Table created successfully');
            this.closeModal();
            this.loadTables();

          },

          error: (err) => {

            console.error(
              'CREATE TABLE ERROR:',
              err
            );

            alert(
              err.error?.message ||
              'Failed to create table'
            );

          }

        });

    }

    else {

      if (!this.editingId) {
        return;
      }

      this.tableService
        .updateTable(
          this.editingId,
          data
        )
        .subscribe({

          next: (res) => {

            console.log(
              'UPDATE TABLE:',
              res
            );

            alert(
              'Table updated successfully'
            );

            this.closeModal();

            this.loadTables();

          },

          error: (err) => {

            console.error(
              'UPDATE TABLE ERROR:',
              err
            );

            alert(
              err.error?.message ||
              'Failed to update table'
            );

          }

        });

    }

  }


  deleteTable(
    table: Table
  ): void {

    if (!table._id) {
      return;
    }


    const confirmDelete =
      confirm(
        `Delete ${table.tableNumber}?`
      );


    if (!confirmDelete) {
      return;
    }


    this.tableService
      .deleteTable(
        table._id
      )
      .subscribe({

        next: () => {

          alert(
            'Table deleted successfully'
          );

          this.loadTables();

        },

        error: (err) => {

          console.error(
            'DELETE TABLE ERROR:',
            err
          );

          alert(
            err.error?.message ||
            'Failed to delete table'
          );

        }

      });

  }

}
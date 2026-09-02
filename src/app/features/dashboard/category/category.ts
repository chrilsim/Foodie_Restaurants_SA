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
  categoryService
} from '../../../core/category.service';

import {
  interfaceCategory
} from '../../../interface/category';


@Component({

  selector:
    'app-category',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    MatIconModule,

    MatButtonModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:
    './category.html',

  styleUrl:
    './category.css'

})


export class Category
  implements OnInit {


  categories:
    interfaceCategory[] = [];


  name = '';

  description = '';


  editingId:
    string | null = null;


  loading = false;


  constructor(
    private categoryService:categoryService,
     private drc:ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadCategories();

  }


  loadCategories(): void {

    this.categoryService
      .getCategory()
      .subscribe({

        next: data => {

          this.categories =data;
          this.drc.detectChanges();

        },

        error: error => {

          console.error(
            'GET CATEGORY ERROR:',
            error
          );

        }

      });

  }


  saveCategory(): void {

    if (
      !this.name.trim()
    ) {

      alert(
        'សូមបញ្ចូលឈ្មោះ Category'
      );

      return;

    }


    const data:interfaceCategory = {

      name:
        this.name.trim(),

      description:
        this.description.trim()

    };


    this.loading = true;


    // ========================================
    // UPDATE
    // ========================================

    if (
      this.editingId
    ) {

      this.categoryService
        .updateCategory(
          this.editingId,
          data
        )
        .subscribe({

          next: () => {

            alert(
              'Category updated successfully'
            );

            this.resetForm();

            this.loadCategories();

          },

          error: error => {

            console.error(error);

            alert(
              'Update Category failed'
            );

            this.loading = false;

          },

          complete: () => {

            this.loading = false;

          }

        });

      return;

    }


    // ========================================
    // CREATE
    // ========================================

    this.categoryService
      .createCategory(data)
      .subscribe({

        next: () => {

          alert(
            'Category created successfully'
          );

          this.resetForm();

          this.loadCategories();

        },

        error: error => {

          console.error(error);

          alert(
            'Create Category failed'
          );

          this.loading = false;

        },

        complete: () => {

          this.loading = false;

        }

      });

  }


  // ==========================================
  // EDIT
  // ==========================================

  editCategory(
    category:
      interfaceCategory
  ): void {

    this.editingId =
      category._id || null;

    this.name =
      category.name;

    this.description =
      category.description || '';

  }


  // ==========================================
  // DELETE
  // ==========================================

  deleteCategory(
    category:
      interfaceCategory
  ): void {

    if (!category._id) {
      return;
    }


    const confirmDelete =
      confirm(
        `Delete "${category.name}"?`
      );


    if (!confirmDelete) {
      return;
    }


    this.categoryService
      .deleteCategory(
        category._id
      )
      .subscribe({

        next: () => {

          alert(
            'Category deleted successfully'
          );

          this.loadCategories();

        },

        error: error => {

          console.error(error);

          alert(
            'Delete Category failed'
          );

        }

      });

  }


  // ==========================================
  // RESET
  // ==========================================

  resetForm(): void {

    this.name = '';

    this.description = '';

    this.editingId = null;

    this.loading = false;

  }

}
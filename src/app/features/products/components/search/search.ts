
import {
  Component,
  OnInit,
  ChangeDetectorRef
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
  MatChipsModule
} from '@angular/material/chips';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import {
  interfaceitemenu
} from '../../../../interface/menuitem';

import {
  MenuService
} from '../../../../core/menuitem.service';

import {
  AddToCartService
} from '../../../../core/addToCart.service';
import { RouterLink } from '@angular/router';


@Component({

  selector: 'app-search',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    MatIconModule,

    MatButtonModule,

    MatFormFieldModule,

    MatInputModule,

    MatChipsModule,

    MatDialogModule,RouterLink

  ],

  templateUrl:
    './search.html',

  styleUrl:
    './search.css'

})


export class Search
  implements OnInit {


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private menuService:
      MenuService,

    private cartService:
      AddToCartService,

    private drc:
      ChangeDetectorRef,

    private dialog:
      MatDialog

  ) {}



  // =====================================================
  // MENU DATA
  // =====================================================

  products:
    interfaceitemenu[] = [];

  filteredProducts:
    interfaceitemenu[] = [];



  // =====================================================
  // SEARCH
  // =====================================================

  searchText =
    '';



  // =====================================================
  // CATEGORY
  // =====================================================

  selectedCategory =
    'All';


  categories:
    string[] = [
      'All'
    ];



  // =====================================================
  // LOADING
  // =====================================================

  isLoading =
    false;



  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadProducts();

  }



  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  loadProducts(): void {

    this.isLoading =
      true;


    this.menuService
      .getMenuItems()
      .subscribe({

        next: (data: any[]) => {

          this.products =
            data.filter(
              item =>
                item.isAvailable === true
            );


          this.filteredProducts =
            [
              ...this.products
            ];


          this.buildCategories();


          this.isLoading =
            false;


          this.drc.detectChanges();

        },


        error: (err) => {

          console.error(
            'SEARCH MENU ERROR:',
            err
          );


          this.products =
            [];

          this.filteredProducts =
            [];


          this.isLoading =
            false;


          this.drc.detectChanges();

        }

      });

  }


  buildCategories(): void {

    const categoryNames =
      this.products

        .map(
          item =>
            this.getCategoryName(item)
        )

        .filter(
          name =>
            !!name
        );


    this.categories = [

      'All',

      ...Array.from(
        new Set(
          categoryNames
        )
      )

    ];

  }



  getCategoryName(
    product: any
  ): string {

    if (
      !product?.categoryId
    ) {

      return '';

    }


    // Populated category

    if (
      typeof product.categoryId ===
      'object'
    ) {

      return (
        product.categoryId.name ||
        ''
      );

    }


    return '';

  }



  // =====================================================
  // SEARCH
  // =====================================================

  search(): void {

    this.applyFilter();

  }



  // =====================================================
  // LIVE SEARCH
  // =====================================================

  onSearchChange(): void {

    this.applyFilter();

  }



  // =====================================================
  // SELECT CATEGORY
  // =====================================================

  selectCategory(
    category: string
  ): void {

    this.selectedCategory =
      category;


    this.applyFilter();

  }



  applyFilter(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredProducts =
      this.products.filter(
        (product: any) => {


          // -------------------------------------------
          // SEARCH
          // -------------------------------------------

          const matchSearch =

            !search

            ||

            String(
              product.name || ''
            )
              .toLowerCase()
              .includes(search)

            ||

            String(
              product.description || ''
            )
              .toLowerCase()
              .includes(search);


          // -------------------------------------------
          // CATEGORY
          // -------------------------------------------

          const categoryName =
            this.getCategoryName(
              product
            );


          const matchCategory =

            this.selectedCategory ===
              'All'

            ||

            categoryName ===
              this.selectedCategory;


          return (
            matchSearch &&
            matchCategory
          );

        }
      );
    this.drc.detectChanges();

  }


  clearSearch(): void {

    this.searchText =
      '';


    this.applyFilter();

  }



  // =====================================================
  // OPEN PRODUCT
  // =====================================================

  openProduct(
    product: interfaceitemenu
  ): void {



    // អ្នកអាចភ្ជាប់ Product Dialog
    // នៅទីនេះនៅពេលក្រោយ

  }


  addToCart(
    product: interfaceitemenu
  ): void {

    if (
      !product.isAvailable
    ) {

      return;

    }


    if (
      product.hasStock &&
      Number(product.stock || 0) <= 0
    ) {

      return;

    }


    this.cartService.addToCart(

      product,

      1,

      []

    );

  }



  // =====================================================
  // CHECK OUT OF STOCK
  // =====================================================

  isOutOfStock(
    product: interfaceitemenu
  ): boolean {

    return (

      product.hasStock === true

      &&

      Number(
        product.stock || 0
      ) <= 0

    );

  }


  getImage(
    image: string
  ): string {

    if (!image) {

      return 'assets/default-food.jpg';

    }


    return image;

  }

}


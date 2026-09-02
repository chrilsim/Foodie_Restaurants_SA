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
  MatTooltipModule
} from '@angular/material/tooltip';

import {
  InventoryService
} from '../../../core/inventory.service';


// ======================================================
// INTERFACE
// ======================================================

export interface InventoryItem {

  _id?: string;

  name: string;

  category: string;

  quantity: number;

  unit: string;

  minimumStock: number;

  costPerUnit: number;

  supplier: string;

  expiryDate: string;

  storageLocation: string;

}


// ======================================================
// COMPONENT
// ======================================================

@Component({

  selector:
    'app-inventory',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    MatIconModule,

    MatButtonModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatTooltipModule

  ],
  templateUrl: './inventory-managerment.html',
  styleUrl: './inventory-managerment.css',

})


export class Inventory
  implements OnInit {


  // ======================================================
  // INVENTORY DATA
  // ======================================================

  items: InventoryItem[] = [];

  filteredItems:
    InventoryItem[] = [];


  // ======================================================
  // SEARCH
  // ======================================================

  searchText = '';


  // ======================================================
  // CATEGORY FILTER
  // ======================================================

  selectedCategory = 'All';


  // ======================================================
  // STATUS FILTER
  // ======================================================

  selectedStatus = 'All';


  // ======================================================
  // CATEGORIES
  // ======================================================

  categories = [

    'All',

    'Meat',

    'Seafood',

    'Vegetable',

    'Fruit',

    'Dairy',

    'Beverage',

    'Sauce',

    'Spice',

    'Grocery',

    'Other'

  ];


  itemCategories = [

    'Meat',

    'Seafood',

    'Vegetable',

    'Fruit',

    'Dairy',

    'Beverage',

    'Sauce',

    'Spice',

    'Grocery',

    'Other'

  ];


  // ======================================================
  // STATUS
  // ======================================================

  statuses = [

    'All',

    'In Stock',

    'Low Stock',

    'Out of Stock'

  ];


  // ======================================================
  // UNITS
  // ======================================================

  units = [

    'kg',

    'g',

    'L',

    'ml',

    'pcs',

    'box',

    'bottle',

    'pack'

  ];


  // ======================================================
  // LOADING
  // ======================================================

  isLoading = false;


  // ======================================================
  // ADD / EDIT MODAL
  // ======================================================

  showModal = false;

  isEditMode = false;

  editingId:
    string | null = null;


  // ======================================================
  // STOCK MODAL
  // ======================================================

  showStockModal = false;

  stockOperation:
    'in' | 'out' = 'in';

  selectedItem:
    InventoryItem | null = null;

  stockQuantity = 1;

  stockReason = '';


  // ======================================================
  // FORM
  // ======================================================

  form: InventoryItem = {

    name: '',

    category: '',

    quantity: 0,

    unit: 'kg',

    minimumStock: 0,

    costPerUnit: 0,

    supplier: '',

    expiryDate: '',

    storageLocation: ''

  };


  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(

    private inventoryService:
      InventoryService,
    private drc: ChangeDetectorRef

  ) { }



  ngOnInit(): void {

    this.loadItems();

  }
  loadItems(): void {
    this.isLoading = true;
    this.inventoryService
      .getItems()
      .subscribe({

        next: (res) => {
          this.items =res?.data || [];
          this.applyFilter();
          this.isLoading = false;
          this.drc.detectChanges();

        },


        error: (err) => {

          console.error(
            'GET INVENTORY ERROR:',
            err
          );
          this.items = [];
          this.filteredItems = [];
          this.isLoading = false;
          this.drc.detectChanges();

          alert(

            err.error?.message ||

            'Failed to load inventory'

          );

        }

      });

  }

  applyFilter(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredItems =this.items.filter((item: InventoryItem) => {
          const matchSearch =
            !search ||
            item.name
              ?.toLowerCase()
              .includes(search)
            ||
            item.category
              ?.toLowerCase()
              .includes(search)

            ||

            item.supplier
              ?.toLowerCase()
              .includes(search)

            ||

            item.storageLocation
              ?.toLowerCase()
              .includes(search);

          const matchCategory =this.selectedCategory ==='All'
            ||
            item.category ===
            this.selectedCategory;
          const matchStatus =this.selectedStatus ==='All'
            ||
            this.getStockStatus(item) ===this.selectedStatus;

          return (

            matchSearch &&

            matchCategory &&

            matchStatus

          );

        }

      );

  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();

  }

  clearFilters(): void {

    this.searchText = '';

    this.selectedCategory =
      'All';

    this.selectedStatus =
      'All';


    this.applyFilter();

  }


  getStockStatus(
    item: InventoryItem
  ): string {


    if (
      Number(item.quantity) <= 0
    ) {

      return 'Out of Stock';

    }


    if (
      Number(item.quantity) <=
      Number(item.minimumStock)
    ) {

      return 'Low Stock';

    }


    return 'In Stock';

  }


  getStockStatusClass(
    item: InventoryItem
  ): string {

    return this
      .getStockStatus(item)
      .toLowerCase()
      .replace(
        /\s+/g,
        '-'
      );

  }


  getTotalItems(): number {

    return this.items.length;

  }

  getInStockCount(): number {
    return this.items.filter(

      item =>
        this.getStockStatus(item) ===
        'In Stock'

    ).length;

  }
  getLowStockCount(): number {

    return this.items.filter(

      item =>
        this.getStockStatus(item) ===
        'Low Stock'

    ).length;

  }

  getOutOfStockCount(): number {

    return this.items.filter(

      item =>
        this.getStockStatus(item) ===
        'Out of Stock'

    ).length;

  }

  getInventoryValue(): number {

    return this.items.reduce(

      (
        total: number,
        item: InventoryItem
      ) => {

        return total +

          (
            Number(item.quantity || 0) *

            Number(
              item.costPerUnit || 0
            )

          );

      },

      0

    );

  }

  isExpired(
    date: string
  ): boolean {

    if (!date) {

      return false;

    }


    const expiry =
      new Date(date);


    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );


    expiry.setHours(
      0,
      0,
      0,
      0
    );


    return expiry < today;

  }

  isExpiringSoon(
    date: string
  ): boolean {

    if (!date) {

      return false;

    }


    const expiry =
      new Date(date);


    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );


    expiry.setHours(
      0,
      0,
      0,
      0
    );


    const difference =
      expiry.getTime() -
      today.getTime();


    const days =
      difference /
      (
        1000 *
        60 *
        60 *
        24
      );


    return (

      days >= 0 &&

      days <= 7

    );

  }

  openAdd(): void {

    this.isEditMode = false;

    this.editingId = null;


    this.resetForm();


    this.showModal = true;

  }


  openEdit(
    item: InventoryItem
  ): void {

    this.isEditMode = true;


    this.editingId =
      item._id || null;


    this.form = {

      name:
        item.name || '',

      category:
        item.category || '',

      quantity:
        Number(item.quantity || 0),

      unit:
        item.unit || 'kg',

      minimumStock:
        Number(
          item.minimumStock || 0
        ),

      costPerUnit:
        Number(
          item.costPerUnit || 0
        ),

      supplier:
        item.supplier || '',

      expiryDate:
        this.formatDateForInput(
          item.expiryDate
        ),

      storageLocation:
        item.storageLocation || ''

    };


    this.showModal = true;

  }


  closeModal(): void {

    this.showModal = false;

    this.editingId = null;

    this.resetForm();

  }




  resetForm(): void {

    this.form = {

      name: '',

      category: '',

      quantity: 0,

      unit: 'kg',

      minimumStock: 0,

      costPerUnit: 0,

      supplier: '',

      expiryDate: '',

      storageLocation: ''

    };

  }


  private formatDateForInput(
    date: any
  ): string {

    if (!date) {

      return '';

    }


    const d =
      new Date(date);


    if (
      isNaN(
        d.getTime()
      )
    ) {

      return '';

    }


    const year =
      d.getFullYear();


    const month =
      String(
        d.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    const day =
      String(
        d.getDate()
      ).padStart(
        2,
        '0'
      );


    return `${year}-${month}-${day}`;

  }


  private validateForm(): boolean {

    if (
      !this.form.name ||
      !this.form.name.trim()
    ) {

      alert(
        'Item name is required'
      );

      return false;

    }


    if (
      !this.form.category
    ) {

      alert(
        'Category is required'
      );

      return false;

    }


    if (
      !this.form.unit
    ) {

      alert(
        'Unit is required'
      );

      return false;

    }


    if (
      Number(this.form.quantity) < 0
    ) {

      alert(
        'Quantity cannot be negative'
      );

      return false;

    }


    if (
      Number(
        this.form.minimumStock
      ) < 0
    ) {

      alert(
        'Minimum stock cannot be negative'
      );

      return false;

    }


    if (
      Number(
        this.form.costPerUnit
      ) < 0
    ) {

      alert(
        'Cost cannot be negative'
      );

      return false;

    }


    return true;

  }


  saveItem(): void {

    if (
      !this.validateForm()
    ) {

      return;

    }


    const data = {

      name:
        this.form.name.trim(),

      category:
        this.form.category,

      quantity:
        Number(
          this.form.quantity || 0
        ),

      unit:
        this.form.unit,

      minimumStock:
        Number(
          this.form.minimumStock || 0
        ),

      costPerUnit:
        Number(
          this.form.costPerUnit || 0
        ),

      supplier:
        this.form.supplier?.trim() || '',

      expiryDate:
        this.form.expiryDate || null,

      storageLocation:
        this.form.storageLocation?.trim() || ''

    };


    if (!this.isEditMode) {

      this.isLoading = true;


      this.inventoryService
        .createItem(data)
        .subscribe({

          next: (res) => {

            console.log(
              'CREATE INVENTORY:',
              res
            );


            alert(
              'Inventory item created successfully'
            );


            this.closeModal();

            this.loadItems();

          },


          error: (err) => {

            console.error(
              'CREATE INVENTORY ERROR:',
              err
            );


            this.isLoading = false;


            alert(

              err.error?.message ||

              'Failed to create inventory item'

            );

          }

        });


      return;

    }
    if (!this.editingId) {

      alert(
        'Inventory ID not found'
      );

      return;

    }


    this.isLoading = true;


    this.inventoryService
      .updateItem(
        this.editingId,
        data
      )
      .subscribe({

        next: (res) => {

          console.log(
            'UPDATE INVENTORY:',
            res
          );


          alert(
            'Inventory item updated successfully'
          );


          this.closeModal();

          this.loadItems();

        },


        error: (err) => {

          console.error(
            'UPDATE INVENTORY ERROR:',
            err
          );


          this.isLoading = false;


          alert(

            err.error?.message ||

            'Failed to update inventory item'

          );

        }

      });

  }


  // ======================================================
  // DELETE ITEM
  // ======================================================

  deleteItem(
    item: InventoryItem
  ): void {

    if (!item._id) {

      alert(
        'Inventory ID not found'
      );

      return;

    }


    const confirmed =
      confirm(

        `Delete "${item.name}"?`

      );


    if (!confirmed) {

      return;

    }


    this.inventoryService
      .deleteItem(
        item._id
      )
      .subscribe({

        next: (res) => {

          console.log(
            'DELETE INVENTORY:',
            res
          );


          alert(
            'Inventory item deleted successfully'
          );


          this.loadItems();

        },


        error: (err) => {

          console.error(
            'DELETE INVENTORY ERROR:',
            err
          );


          alert(

            err.error?.message ||

            'Failed to delete inventory item'

          );

        }

      });

  }


  // ======================================================
  // STOCK IN
  // ======================================================

  stockIn(
    item: InventoryItem
  ): void {

    if (!item._id) {

      alert(
        'Inventory ID not found'
      );

      return;

    }


    this.selectedItem = item;

    this.stockOperation = 'in';

    this.stockQuantity = 1;

    this.stockReason = '';


    this.showStockModal = true;

  }


  // ======================================================
  // STOCK OUT
  // ======================================================

  stockOut(
    item: InventoryItem
  ): void {

    if (!item._id) {

      alert(
        'Inventory ID not found'
      );

      return;

    }


    this.selectedItem = item;

    this.stockOperation = 'out';

    this.stockQuantity = 1;

    this.stockReason = '';


    this.showStockModal = true;

  }


  // ======================================================
  // CLOSE STOCK MODAL
  // ======================================================

  closeStockModal(): void {

    this.showStockModal = false;

    this.selectedItem = null;

    this.stockQuantity = 1;

    this.stockReason = '';

  }


  // ======================================================
  // SAVE STOCK IN / OUT
  // ======================================================

  saveStockOperation(): void {

    if (!this.selectedItem) {

      alert(
        'Inventory item not selected'
      );

      return;

    }


    if (!this.selectedItem._id) {

      alert(
        'Inventory ID not found'
      );

      return;

    }


    const quantity =
      Number(
        this.stockQuantity
      );


    // ====================================================
    // VALIDATE QUANTITY
    // ====================================================

    if (
      !quantity ||
      quantity <= 0
    ) {

      alert(
        'Please enter a valid quantity'
      );

      return;

    }


    // ====================================================
    // STOCK OUT CHECK
    // ====================================================

    if (

      this.stockOperation === 'out' &&

      quantity >
      Number(
        this.selectedItem.quantity
      )

    ) {

      alert(

        `Not enough stock. Available: ` +

        `${this.selectedItem.quantity} ` +

        `${this.selectedItem.unit}`

      );

      return;

    }


    const id =
      this.selectedItem._id;


    const reason =
      this.stockReason.trim();


    this.isLoading = true;


    // ====================================================
    // STOCK IN
    // ====================================================

    if (
      this.stockOperation === 'in'
    ) {

      this.inventoryService
        .stockIn(
          id,
          quantity,
          reason
        )
        .subscribe({

          next: (res) => {

            console.log(
              'STOCK IN:',
              res
            );


            alert(
              'Stock added successfully'
            );


            this.closeStockModal();

            this.loadItems();

          },


          error: (err) => {

            console.error(
              'STOCK IN ERROR:',
              err
            );


            this.isLoading = false;


            alert(

              err.error?.message ||

              'Failed to add stock'

            );

          }

        });


      return;

    }


    // ====================================================
    // STOCK OUT
    // ====================================================

    this.inventoryService
      .stockOut(
        id,
        quantity,
        reason
      )
      .subscribe({

        next: (res) => {

          console.log(
            'STOCK OUT:',
            res
          );


          alert(
            'Stock removed successfully'
          );


          this.closeStockModal();

          this.loadItems();

        },


        error: (err) => {

          console.error(
            'STOCK OUT ERROR:',
            err
          );


          this.isLoading = false;


          alert(

            err.error?.message ||

            'Failed to remove stock'

          );

        }

      });

  }


  // ======================================================
  // GET STOCK HISTORY
  // ======================================================

  getStockHistory(
    item: InventoryItem
  ): void {

    if (!item._id) {

      return;

    }


    this.inventoryService
      .getStockHistory(
        item._id
      )
      .subscribe({

        next: (res) => {

          console.log(
            'STOCK HISTORY:',
            res
          );

        },

        error: (err) => {

          console.error(
            'STOCK HISTORY ERROR:',
            err
          );

        }

      });

  }

}
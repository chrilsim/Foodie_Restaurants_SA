import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MenuService } from '../../../core/menuitem.service';
import { interfaceitemenu } from '../../../interface/menuitem';
import { CommonModule } from '@angular/common';
import { UsdToKhrPipe } from '../../../shared/pipes/usd-to-khr';
import { NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { interfaceCategory } from '../../../interface/category';
import { categoryService } from '../../../core/category.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-menu-management',
  imports: [MatIcon, MatCardModule, MatProgressSpinnerModule, MatSnackBarModule, MatSelectModule,
    MatMenuModule, UsdToKhrPipe, ReactiveFormsModule, CommonModule, MatDialogModule, MatSlideToggleModule,
    MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule
  ],
  templateUrl: './menu-management.html',
  styleUrl: './menu-management.css',
})
export class MenuManagement implements OnInit {

  @ViewChild('addItemDialog') addItemDialog!: TemplateRef<any>;
  @ViewChild('editItemDialog') editItemDialog!: TemplateRef<any>;

  form!: FormGroup;
  selectedFile: File | null = null;
  constructor(
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public menuitemService: MenuService,
    public categoeyService: categoryService
  ) { }
  menuitems: interfaceitemenu[] = [];
  categorys: interfaceCategory[] = [];
  menuItem: interfaceitemenu = {
    _id: '',
    categoryId: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    stock: 0,
    isAvailable: false
  }
  isLoading = false;
  ngOnInit(): void {
    this.loadMenuItems();
    // ----------menu---------
    // this.menuitemService.getMenuItems().subscribe({
    //   next: (data) => {
    //     this.menuitems = data,
    //     this.filteredMenuitems = data;
    //     this.cdr.detectChanges();
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });
    // ----------catgory---------

    this.categoeyService.getCategory().subscribe({
      next: (data) => {
        this.categorys = data
          this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.form = this.fb.group({ categoryId: [''], name: [''], description: [''], price: [0], cost: [0], stock: [0], isAvailable: [true] });
  }
  loadMenuItems(): void {
    this.menuitemService.getMenuItems().subscribe({
      next: data => {
        console.log('MENU DATA:', data);
        this.menuitems = [...data];
        this.refreshMenuItems();
      },

      error: err => {
        console.error('MENU ERROR:', err);
      }
    });
  }
  selectedCategoryId: string = 'all';
  filteredMenuitems: interfaceitemenu[] = [];
  filterCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.refreshMenuItems();
  }
  refreshMenuItems(): void {
    if (this.selectedCategoryId === 'all') {
      this.filteredMenuitems = [...this.menuitems];
      return;
    }

    this.filteredMenuitems = this.menuitems.filter(
      item =>
        String(item.categoryId) ===
        String(this.selectedCategoryId)
    );
    this.cdr.detectChanges();

  }
  toggleAvailability(item: interfaceitemenu) {
    const newStatus = !item.isAvailable;
    item.isAvailable = !item.isAvailable;
    this.menuitemService
      .updateAvailability(item._id, newStatus)
      .subscribe({
        next: () => {
          item.isAvailable = newStatus;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
  openAddItem() {
    this.resetForm();
    this.dialog.open(
      this.addItemDialog,
      {
        width: '600px'
      }
    );
  }
  resetForm() {
    this.form.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      isAvailable: true
    });
    this.selectedFile = null;
    this.selectedItem = null;
  }
  // --------------------create-------------
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  onSubmit() {
    if (this.form.invalid) {
      alert('Please fill all required fields');
      return;
    }
    const formData = new FormData();
    formData.append('name', this.form.value.name || '');
    formData.append('description', this.form.value.description || '');
    formData.append('price', String(this.form.value.price || 0));
    formData.append('stock', String(this.form.value.stock || 0));
    formData.append('isAvailable', String(this.form.value.isAvailable));
    formData.append('categoryId', this.form.value.categoryId || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.isLoading = true;
    this.menuitemService.create(formData).subscribe({
      next: (newItem) => {

        console.log('CREATE RESPONSE:', newItem);

        this.menuitems = [ newItem, ...this.menuitems];
        this.refreshMenuItems();
        this.cdr.detectChanges();
        this.isLoading = false;
        this.snackBar.open(
          '✅ Saved successfully',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

        this.form.reset({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          categoryId: '',
          isAvailable: true
        });

        this.selectedFile = null;
        this.dialog.closeAll();
      },
      error: err => {
        console.error('CREATE ERROR:', err);
        this.isLoading = false;
        this.snackBar.open('❌ Save failed', 'Close',
          {
            duration: 3000
          }
        );
      }
    });
  }
  // =====================update==================
  selectedItem: interfaceitemenu | null = null;
  openEditDialog(id: string) {
    const item = this.menuitems.find(x => x._id === id);
    if (!item) { return; }
    this.selectedItem = item;
    this.form.patchValue({
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      categoryId: item.categoryId,
      isAvailable: item.isAvailable
    });
    this.selectedFile = null;
    this.dialog.open(this.editItemDialog, {
      width: '500px'
    });
  }
  closeDialog() {
    this.dialog.closeAll(); this.resetForm();
  }
  onUpdate(item: interfaceitemenu) {
    const formData = new FormData();
    formData.append('categoryId', this.form.value.categoryId || '');
    formData.append('name', this.form.value.name || '');
    formData.append('description', this.form.value.description || '');
    formData.append('price', String(this.form.value.price || 0));
    formData.append('stock', String(this.form.value.stock || 0));
    formData.append('isAvailable', String(this.form.value.isAvailable));
    if (this.selectedFile) { formData.append('image', this.selectedFile) }

    this.menuitemService.update(item._id!, formData).subscribe({
      next: updatedItem => {
        const index = this.menuitems.findIndex(x => x._id === updatedItem._id);
        if (index !== -1) {
          this.menuitems[index] = updatedItem;
          this.menuitems = [...this.menuitems];
        }
        this.refreshMenuItems();
         this.cdr.detectChanges();
        alert('Updated successfully');
        this.dialog.closeAll();
        this.resetForm();
        this.dialog.closeAll();
      },
      error: err => {
        console.error('UPDATE ERROR:', err);
        alert('Update failed');
      }
    });
  }
  // ===================delete==================

  deleteItem(id: string) {
    if (!id) { return; }
    const confirmDelete = confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) { return; }
    this.menuitemService.delete(id).subscribe({
      next: () => {
        this.menuitems = this.menuitems.filter(item => item._id !== id);
        this.refreshMenuItems();
        alert('Deleted successfully');
      },
      error: err => {
        console.error('DELETE ERROR:', err);
        alert('Delete failed');
      }
    });
  }

}

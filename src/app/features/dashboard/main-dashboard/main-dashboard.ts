import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/auth.service';
import { interfaceuser } from '../../../interface/user';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { Notification } from '../notification/notification';
@Component({
  selector: 'app-main-dashboard',
  imports: [MatIcon, MatFormFieldModule, MatMenuModule, MatInputModule, RouterLinkActive, MatButtonModule, MatIconModule, RouterLink, RouterOutlet],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
})
export class MainDashboard {
  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  users: interfaceuser[] = [];
  user: interfaceuser = {
    _id: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  }
  ngOnInit(): void {
    this.user = this.authService.getUser();

  }
  openNotifications(): void {

    this.dialog.open(
      Notification,
      {

        width: '520px',

        maxWidth: '95vw',

        maxHeight: '90vh',

        panelClass:
          'Notification'

      }

    );

  }
}

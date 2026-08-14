import { Component } from '@angular/core';
import { MatDialogActions } from "@angular/material/dialog";
import{MatIconModule} from "@angular/material/icon";
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-menu-drawer',
  imports: [MatDialogActions, MatIconModule, RouterLink],
  templateUrl: './menu-drawer.html',
  styleUrl: './menu-drawer.css',
})
export class MenuDrawer {}

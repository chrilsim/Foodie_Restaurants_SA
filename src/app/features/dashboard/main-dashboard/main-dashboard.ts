import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import{MatIconModule} from '@angular/material/icon';
import { RouterLink, RouterOutlet } from "@angular/router";
@Component({
  selector: 'app-main-dashboard',
  imports: [MatIcon, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, RouterOutlet],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
})
export class MainDashboard {}

import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}

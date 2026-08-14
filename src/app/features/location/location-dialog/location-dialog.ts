import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-location-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './location-dialog.html',
  styleUrl: './location-dialog.css',
})
export class LocationDialog {
    latitude!: number;
  longitude!: number;

  mapUrl!: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  getCurrentLocation(): void {

    if (!navigator.geolocation) {
      alert('Browser does not support Geolocation');
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&z=16&output=embed`
        );

      },

      (error) => {

        switch (error.code) {

          case error.PERMISSION_DENIED:
            alert('Permission denied');
            break;

          case error.POSITION_UNAVAILABLE:
            alert('Location unavailable');
            break;

          case error.TIMEOUT:
            alert('Request timeout');
            break;

          default:
            alert('Unknown error');
        }

      }

    );

  }
}

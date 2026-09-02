import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MatDialogModule,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';

import { MatButtonModule }
  from '@angular/material/button';

import { MatIconModule }
  from '@angular/material/icon';

import { MatFormFieldModule }
  from '@angular/material/form-field';

import { MatInputModule }
  from '@angular/material/input';

import {
  FormsModule
} from '@angular/forms';

import * as L from 'leaflet';

import {
  AddressService
} from '../../../core/address.service';

import {
  Addressinterface
} from '../../../interface/address';

import {
  AddAddressDialog
} from '../add-address-dialog/add-address-dialog';


@Component({
  selector: 'app-location-dialog',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],

  templateUrl:
    './location-dialog.html',

  styleUrl:
    './location-dialog.css'
})


export class LocationDialog implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private marker!: L.Marker;
  latitude!: number;
  longitude!: number;
  searchText = '';
  searching = false;

  addresses:
    Addressinterface[] = [];

  selectedAddressId:
    string | null = null;
  locationLoading = false;
  saving = false;

  private defaultLat =11.5564;
  private defaultLng =104.9282;
  constructor(
    private addressService:AddressService,
    private dialogRef:MatDialogRef<LocationDialog>,
    private dialog:MatDialog,
    private drc:ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadAddresses();

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 300);

  }

  initMap(): void {
    this.map =L.map(
        'location-map',
        {
          center: [
            this.defaultLat,
            this.defaultLng
          ],

          zoom: 13
        }
      );


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:'&copy; OpenStreetMap contributors'
      }).addTo(this.map);

    this.map.on('click',(event:L.LeafletMouseEvent) => {
        this.setLocation(
          event.latlng.lat,
          event.latlng.lng

        );

      }
    );
    setTimeout(() => {

      this.map.invalidateSize();

    }, 500);

  }

  setLocation(lat: number,lng: number): void {
    this.latitude =Number(lat.toFixed(7));
    this.longitude =Number(lng.toFixed(7));
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker =L.marker(
        [lat, lng],
        {
          draggable: true
        }
      )
      .addTo(this.map);
    this.marker.bindPopup(
      `
        <div style="text-align:center">
          <strong>📍 Selected Location</strong>
          <br>
          ${this.latitude},
          ${this.longitude}
        </div>
      `
    );


    this.marker.openPopup();
    this.marker.on('dragend',() => {
        const position =this.marker.getLatLng();
        this.latitude =Number(position.lat.toFixed(7));
        this.longitude =Number(position.lng.toFixed(7));
        this.marker.setPopupContent(
            `<div style="text-align:center">
                <strong>📍 Selected Location</strong><br>${this.latitude},${this.longitude}
              </div>
            `
          );

        this.drc.detectChanges();

      }
    );


    this.drc.detectChanges();

  }

  getCurrentLocation(): void {

    if (!navigator.geolocation) {

      alert(
        'Browser does not support Geolocation'
      );

      return;

    }


    this.locationLoading = true;


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;


        this.setLocation(
          lat,
          lng
        );


        this.map.setView(
          [lat, lng],
          17
        );


        this.locationLoading = false;


        this.drc.detectChanges();

      },


      (error) => {

        this.locationLoading = false;


        switch (
          error.code
        ) {

          case error.PERMISSION_DENIED:

            alert(
              'Location permission denied'
            );

            break;


          case error.POSITION_UNAVAILABLE:

            alert(
              'Location unavailable'
            );

            break;


          case error.TIMEOUT:

            alert(
              'Location request timeout'
            );

            break;


          default:

            alert(
              'Unknown location error'
            );

        }

      },


      {

        enableHighAccuracy:
          true,

        timeout:
          15000,

        maximumAge:
          0

      }

    );

  }


  searchLocation(): void {
    const query =this.searchText.trim();
    if (!query) {

      alert(
        'Please enter address'
      );

      return;

    }
    this.searching = true;
    const url =`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    fetch(url, {
      headers: {
        'Accept':'application/json'
      }

    })

    .then(response =>response.json())
    .then(results => {
        this.searching = false;
        if (!results ||results.length === 0) {
          alert('Location not found');
          return;
        }
        const result =results[0];
        const lat =Number(result.lat);
        const lng =Number(result.lon);
        this.setLocation(lat,lng);
        this.map.setView([lat, lng],17);
      }
    )

    .catch(
      error => {
        console.error(
          'SEARCH LOCATION ERROR:',
          error
        );

        this.searching = false;
        alert(
          'Search location failed'
        );

      }
    );

  }
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchLocation();
    }
  }
  loadAddresses(): void {
    this.addressService.getAddresses().subscribe({
        next: (data) => {
          this.addresses =data || [];
          this.drc.detectChanges();
        },

        error: (
          error
        ) => {

          console.error(
            'GET ADDRESSES ERROR:',
            error
          );

        }

      });

  }
  selectAddress(address:Addressinterface): void {
    this.selectedAddressId =address._id || null;
    if (address.latitude === undefined ||address.longitude === undefined) {
      return;
    }
    this.setLocation(
      address.latitude,
      address.longitude
    );
    this.map.setView(
      [
        address.latitude,
        address.longitude
      ],
      17
    );
    this.drc.detectChanges();
  }


  saveLocation(): void {
    if (this.selectedAddressId) {
      const selected =this.addresses.find(
          address =>
            address._id ===
            this.selectedAddressId
        );
      if (selected) {
        this.dialogRef.close(selected);
        return;
      }

    }

    if (this.latitude === undefined ||this.longitude === undefined) {
      alert(
        'សូមជ្រើសរើសទីតាំងជាមុនសិន'
      );

      return;

    }

    const userData =
      localStorage.getItem(
        'user'
      );


    if (!userData) {

      alert('Please login first');
      return;
    }
    const user =JSON.parse(userData);

    const addressData:
      Addressinterface = {

      label:
        'Home',

      receiverName:
        user.fullName ||
        'Customer',

      phone:
        user.phone ||
        '',

      address:
        this.searchText.trim() ||
        'Selected Location',

      city:
        'Phnom Penh',

      province:
        'Phnom Penh',

      latitude:
        this.latitude,

      longitude:
        this.longitude,

      isDefault:
        this.addresses.length === 0

    };


    this.saving = true;

    this.addressService.createAddress(
        addressData
      )
      .subscribe({

        next: (
          response: any
        ) => {

          this.saving = false;


          const newAddress =
            response?.data ||
            response;


          if (
            newAddress
          ) {

            this.addresses =
              [
                newAddress,
                ...this.addresses
              ];

            this.selectedAddressId =
              newAddress._id ||
              null;

            this.dialogRef.close(
              newAddress
            );

          }

        },
        error: (
          error
        ) => {
          console.error(
            'SAVE ADDRESS ERROR:',
            error
          );

          this.saving = false;
          alert(
            error?.error?.message ||
            'Failed to save address'
          );

        }

      });

  }

  deleteAddress(id: string): void {
    const confirmed =confirm('Are you sure you want to delete this address?');
    if (!confirmed) {
      return;
    }
    this.addressService.deleteAddress(id)
      .subscribe({
        next: () => {
          this.addresses =this.addresses.filter(
              address =>address._id !== id
            );
          if (this.selectedAddressId === id) {
            this.selectedAddressId =null;
          }
          this.drc.detectChanges();
        },

        error: (
          error
        ) => {

          console.error(
            'DELETE ADDRESS ERROR:',
            error
          );

          alert(
            error?.error?.message ||
            'Delete address failed'
          );

        }

      });

  }


  updateAddress(
    address:
      Addressinterface
  ): void {

    const dialogRef =
      this.dialog.open(
        AddAddressDialog,
        {

          width:
            '500px',

          maxWidth:
            '95vw',

          data: {

            ...address,

            editMode:
              true

          }

        }
      );


    dialogRef
      .afterClosed()
      .subscribe(
        result => {

          if (result) {

            this.loadAddresses();

          }

        }
      );

  }


  openAddAddressDialog(): void {

    const dialogRef =
      this.dialog.open(
        AddAddressDialog,
        {

          width:
            '500px',

          maxWidth:
            '95vw',

          data: {

            latitude:
              this.latitude,

            longitude:
              this.longitude

          }

        }
      );


    dialogRef
      .afterClosed()
      .subscribe(
        result => {

          if (result) {

            this.addresses =
              [
                result,
                ...this.addresses
              ];

          }

        }
      );

  }

  close(): void {

    this.dialogRef.close();

  }


  ngOnDestroy(): void {

    if (this.map) {

      this.map.remove();

    }

  }

}
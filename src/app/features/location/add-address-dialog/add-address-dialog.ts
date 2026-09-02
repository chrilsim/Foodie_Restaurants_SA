
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatFormFieldModule }
  from '@angular/material/form-field';

import { MatInputModule }
  from '@angular/material/input';

import { MatSelectModule }
  from '@angular/material/select';

import { MatButtonModule }
  from '@angular/material/button';

import { MatCheckboxModule }
  from '@angular/material/checkbox';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';

import { MatIconModule }
  from '@angular/material/icon';

import * as L from 'leaflet';

import {
  AddressService
} from '../../../core/address.service';

import {
  Addressinterface,
  AddressResponse
} from '../../../interface/address';


@Component({

  selector:
    'app-add-address-dialog',

  standalone: true,

  imports: [

    FormsModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatButtonModule,

    MatCheckboxModule,

    MatDialogActions,

    MatDialogContent,

    MatIconModule

  ],

  templateUrl:
    './add-address-dialog.html',

  styleUrl:
    './add-address-dialog.css'

})


export class AddAddressDialog implements AfterViewInit, OnDestroy {

  address:Addressinterface;
  private map!: L.Map;
  private marker!: L.Marker;
  searchText = '';

  searching = false;

  saving = false;

  locationLoading = false;
  constructor(

    @Inject(MAT_DIALOG_DATA)
    public data: any,

    private addressService:
      AddressService,

    private dialogRef:
      MatDialogRef<AddAddressDialog>

  ) {

    this.address = {

      label:
        'Home',

      receiverName:
        '',

      phone:
        '',

      address:
        '',

      city:
        '',

      province:
        '',

      latitude:
        this.data?.latitude ??
        11.5564,

      longitude:
        this.data?.longitude ??
        104.9282,

      isDefault:
        false

    };


    if (
      this.data?.editMode
    ) {

      this.address = {

        ...this.address,

        ...this.data

      };

    }

  }


  ngAfterViewInit(): void {

    setTimeout(() => {

      this.initMap();

    }, 300);

  }

  initMap(): void {

    const lat =
      this.address.latitude ||
      11.5564;

    const lng =
      this.address.longitude ||
      104.9282;


    this.map =
      L.map(
        'add-address-map'
      ).setView(

        [
          lat,
          lng
        ],

        16

      );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom:19,
        attribution:'&copy; OpenStreetMap contributors'
      }

    ).addTo(this.map);

    this.setMarker(lat,lng);
    this.map.on(
      'click',

      (
        event:
          L.LeafletMouseEvent
      ) => {

        this.setMarker(

          event.latlng.lat,

          event.latlng.lng

        );

      }

    );
    setTimeout(() => {

      this.map.invalidateSize();

    }, 500);

  }
  setMarker(
    lat: number,
    lng: number
  ): void {


    this.address.latitude =
      Number(
        lat.toFixed(7)
      );


    this.address.longitude =
      Number(
        lng.toFixed(7)
      );

    if (this.marker) {

      this.map.removeLayer(
        this.marker
      );

    }

    this.marker =
      L.marker(

        [
          lat,
          lng
        ],

        {
          draggable: true
        }

      ).addTo(this.map);
    this.marker.bindPopup(

      `
        <div style="text-align:center">
          <strong>
            📍 Delivery Location
          </strong>
          <br>
          ${lat.toFixed(6)},
          ${lng.toFixed(6)}
        </div>
      `

    );

    this.marker.on('dragend',() => {
        const position =this.marker.getLatLng();
        this.address.latitude =
          Number(
            position.lat.toFixed(7)
          );


        this.address.longitude =
          Number(
            position.lng.toFixed(7)
          );

      }

    );

  }

  getCurrentLocation(): void {

    if (
      !navigator.geolocation
    ) {

      alert(
        'Browser does not support Geolocation'
      );

      return;

    }


    this.locationLoading =
      true;


    navigator.geolocation
      .getCurrentPosition(

        position => {

          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;


          this.setMarker(
            lat,
            lng
          );


          this.map.setView(

            [
              lat,
              lng
            ],

            18

          );


          this.locationLoading =
            false;

        },

        error => {

          console.error(
            error
          );


          this.locationLoading =
            false;


          alert(
            'Unable to get current location'
          );

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

    const query =
      this.searchText.trim();


    if (!query) {
      alert('Please enter location');
      return;
    }
    this.searching =true;
    const url =`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    fetch(url,
      {
        headers: {
          Accept:'application/json'

        }

      }

    )

      .then(
        response =>
          response.json()
      )

      .then(

        results => {

          this.searching =
            false;


          if (
            !results ||
            results.length === 0
          ) {

            alert(
              'Location not found'
            );

            return;

          }

          const result =
            results[0];


          const lat =
            Number(result.lat);

          const lng =
            Number(result.lon);


          this.setMarker(
            lat,
            lng
          );


          this.map.setView(

            [
              lat,
              lng
            ],

            17

          );

        }

      )

      .catch(

        error => {

          console.error(
            'SEARCH ERROR:',
            error
          );


          this.searching =
            false;


          alert(
            'Search failed'
          );

        }

      );

  }


  onSearchKeydown(
    event: KeyboardEvent
  ): void {

    if (
      event.key === 'Enter'
    ) {

      event.preventDefault();

      this.searchLocation();

    }

  }
  save(): void {
    if (
      !this.address.receiverName ||
      !this.address.phone ||
      !this.address.address
    ) {

      alert(
        'Please fill in all required fields'
      );

      return;

    }


    this.saving =true;

    const addressData:
      Addressinterface = {

      label:
        this.address.label as
        'Home' |
        'Work' |
        'Other',

      receiverName:
        this.address.receiverName,

      phone:
        this.address.phone,

      address:
        this.address.address,

      city:
        this.address.city,

      province:
        this.address.province,

      latitude:
        this.address.latitude,

      longitude:
        this.address.longitude,

      isDefault:
        this.address.isDefault

    };

    if (
      this.data?.editMode &&
      this.address._id
    ) {

      this.addressService
        .updateAddress(

          this.address._id,

          addressData

        )
        .subscribe({

          next:
            (
              response: any
            ) => {

              this.saving =
                false;

              this.dialogRef.close(
                response.data ||
                response
              );

            },

          error:
            error => {

              console.error(
                'UPDATE ADDRESS ERROR:',
                error
              );

              this.saving =
                false;

              alert(
                error?.error?.message ||
                'Update address failed'
              );

            }

        });

      return;

    }

    this.addressService.createAddress(addressData).subscribe({
        next:
          (
            response:
              AddressResponse
          ) => {

            this.saving =false;
            this.dialogRef.close(
              response.data
            );

          },

        error:
          error => {

            console.error(
              'SAVE ADDRESS ERROR:',
              error
            );


            this.saving =
              false;


            alert(
              error?.error?.message ||
              'Failed to save address'
            );

          }

      });

  }

  cancel(): void {

    this.dialogRef.close();

  }

  ngOnDestroy(): void {

    if (this.map) {

      this.map.remove();

    }

  }

}


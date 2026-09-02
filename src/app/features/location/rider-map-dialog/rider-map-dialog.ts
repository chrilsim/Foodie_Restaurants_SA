import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  CommonModule
} from '@angular/common';


declare const google: any;


@Component({
  selector: 'app-rider-map-dialog',

  standalone: true,

  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl:
    './rider-map-dialog.html',

  styleUrl:
    './rider-map-dialog.css'
})
export class RiderMapDialog implements AfterViewInit, OnDestroy {

  map: any;

  riderMarker: any;

  customerMarker: any;
  routePolylines: any[] = [];
  distance ='Calculating...';
  duration ='Calculating...';
  isMapLoading =true;
  mapError ='';

  constructor(

    private dialogRef:MatDialogRef<RiderMapDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private cdr:ChangeDetectorRef

  ) {}

  ngAfterViewInit(): void {

    setTimeout(() => {

      this.initGoogleMap();

    }, 300);

  }


  async initGoogleMap(): Promise<void> {

    try {

      this.isMapLoading = true;

      this.mapError = '';

      if (
        typeof google === 'undefined'
      ) {

        throw new Error(
          'Google Maps API is not loaded'
        );

      }

      const rider =this.data?.riderLocation;
      const customer =this.data?.customerLocation;


      if (!rider || !customer) {

        throw new Error(
          'Rider or Customer location is missing'
        );

      }

      const riderLat =
        Number(
          rider.latitude
        );


      const riderLng =
        Number(
          rider.longitude
        );


      const customerLat =
        Number(
          customer.latitude
        );


      const customerLng =
        Number(
          customer.longitude
        );


      if (

        !Number.isFinite(riderLat) ||

        !Number.isFinite(riderLng) ||

        !Number.isFinite(customerLat) ||

        !Number.isFinite(customerLng)

      ) {

        throw new Error(
          'Invalid GPS coordinates'
        );

      }


      const {
        Map
      } =
        await google.maps.importLibrary(
          'maps'
        );

      const {
        AdvancedMarkerElement,
        PinElement
      } =
        await google.maps.importLibrary(
          'marker'
        );


      const {
        Route
      } =
        await google.maps.importLibrary(
          'routes'
        );

      const riderPosition = {

        lat: riderLat,

        lng: riderLng

      };


      const customerPosition = {

        lat: customerLat,

        lng: customerLng

      };

      const center = {

        lat:
          (
            riderLat +
            customerLat
          ) / 2,

        lng:
          (
            riderLng +
            customerLng
          ) / 2

      };

      this.map =
        new Map(

          document.getElementById(
            'rider-map'
          ),

          {

            center:
              center,

            zoom:
              14,

            mapId:
              'DEMO_MAP_ID',

            mapTypeControl:
              false,

            streetViewControl:
              false,

            fullscreenControl:
              true,

            zoomControl:
              true

          }

        );

      const riderPin =new PinElement({

          background:'#2563eb',
          borderColor:'#ffffff',
          glyphColor:'#ffffff',
          scale:1.15
        });
      this.riderMarker =new AdvancedMarkerElement({
          map:
            this.map,

          position:
            riderPosition,

          title:
            'Rider',

          content:
            riderPin.element

        });

      const customerPin =new PinElement({

          background:
            '#ef4444',

          borderColor:
            '#ffffff',

          glyphColor:
            '#ffffff',

          scale:
            1.15

        });

      this.customerMarker =new AdvancedMarkerElement({
          map:
            this.map,

          position:
            customerPosition,

          title:
            this.getCustomerName(),

          content:
            customerPin.element

        });

      const { routes } =
        await Route.computeRoutes({

          origin:
            riderPosition,

          destination:
            customerPosition,

          travelMode:
            'DRIVING',

          fields: [

            'path',

            'distanceMeters',

            'durationMillis'

          ]

        });

      if (
        !routes ||
        routes.length === 0
      ) {

        throw new Error(
          'No driving route found'
        );

      }


      const route =routes[0];
      if (
        route.distanceMeters != null
      ) {

        this.distance =
          this.formatDistance(
            route.distanceMeters
          );

      }

      if (
        route.durationMillis != null
      ) {

        this.duration =
          this.formatDuration(
            route.durationMillis
          );

      }

      if (
        route.path
      ) {

        const polylines =
          route.createPolylines({

            polylineOptions: {

              strokeColor:
                '#2563eb',

              strokeOpacity:
                0.85,

              strokeWeight:
                6

            }

          });


        for (
          const polyline
          of polylines
        ) {

          polyline.setMap(
            this.map
          );

          this.routePolylines.push(
            polyline
          );

        }

      }

      const bounds =new google.maps.LatLngBounds();

      bounds.extend(
        riderPosition
      );


      bounds.extend(
        customerPosition
      );


      this.map.fitBounds(

        bounds,

        80

      );

      this.isMapLoading =false;
      this.cdr.detectChanges();

    } catch (error) {

      console.error(
        'GOOGLE MAP ERROR:',
        error
      );

      this.mapError ='Unable to load Google Maps';

      this.isMapLoading =false;
      this.cdr.detectChanges();

    }

  }

  getCustomerName(): string {
    return (

      this.data
        ?.delivery
        ?.orderId
        ?.userId
        ?.fullName

      ||

      'Customer'

    );

  }


  formatDistance(
    meters: number
  ): string {

    if (
      meters < 1000
    ) {

      return (
        Math.round(meters) +
        ' m'
      );

    }


    return (

      (
        meters / 1000
      ).toFixed(2)

      +

      ' km'

    );

  }

  formatDuration(
    milliseconds: number
  ): string {

    const totalMinutes =
      Math.round(
        milliseconds /
        60000
      );


    if (
      totalMinutes < 1
    ) {

      return '< 1 min';

    }


    if (
      totalMinutes < 60
    ) {

      return (
        totalMinutes +
        ' min'
      );

    }


    const hours =
      Math.floor(
        totalMinutes / 60
      );


    const minutes =
      totalMinutes % 60;


    if (
      minutes === 0
    ) {

      return (
        hours +
        ' hr'
      );

    }


    return (

      hours +
      ' hr ' +

      minutes +
      ' min'

    );

  }

  openGoogleMaps(): void {

    const customer =
      this.data?.customerLocation;


    const rider =
      this.data?.riderLocation;


    if (
      !customer
    ) {

      return;

    }


    const customerLat =
      Number(
        customer.latitude
      );


    const customerLng =
      Number(
        customer.longitude
      );


    const riderLat =
      Number(
        rider?.latitude
      );


    const riderLng =
      Number(
        rider?.longitude
      );


    let url = '';


    if (

      Number.isFinite(
        riderLat
      ) &&

      Number.isFinite(
        riderLng
      )

    ) {

      url =
        `https://www.google.com/maps/dir/?api=1` +

        `&origin=${riderLat},${riderLng}` +

        `&destination=${customerLat},${customerLng}` +

        `&travelmode=driving`;

    } else {

      url =
        `https://www.google.com/maps/dir/?api=1` +

        `&destination=${customerLat},${customerLng}` +

        `&travelmode=driving`;

    }


    window.open(
      url,
      '_blank'
    );

  }

  ngOnDestroy(): void {
    this.map =
      null;

    this.riderMarker =
      null;

    this.customerMarker =
      null;

    this.routePolylines =
      [];

  }

}
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';

import { RiderDeliveryService } from '../../../../core/rider-delivery.service';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { RiderMapDialog } from '../../../location/rider-map-dialog/rider-map-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-rider-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSpinner
  ],

  templateUrl:
    './rider-dashboard.html',

  styleUrl:
    './rider-dashboard.css'
})
export class RiderDashboard implements OnInit, OnDestroy {

  deliveries: any[] = [];
  isLoading = false;
  private watchId:number | null = null;
  constructor(
    private deliveryService:RiderDeliveryService,
    private dialog:MatDialog,
    private drc:ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.loadDeliveries();
  }
  loadDeliveries(): void {
    this.isLoading = true;
    this.deliveryService.getMyDeliveries()
      .subscribe({
        next: (response) => {
          this.deliveries =response?.data || [];
          this.isLoading = false;
          this.drc.detectChanges();
        },
        error: (error) => {
          console.error(
            'GET DELIVERIES ERROR:',
            error
          );
          this.deliveries = [];
          this.isLoading = false;
        }

      });
  }
  doAction( delivery: any ): void {
    if (  delivery.status ==='Assigned'  ) {
      this.acceptDelivery(delivery);
      return;
    }
    if (delivery.status ==='Accepted') {
      this.pickupDelivery(delivery);
      return;
    }
    if (delivery.status ==='PickedUp' ) {
      this.startDelivery(delivery);
      return;
    }
    if (delivery.status ==='Delivering') {
      this.completeDelivery(delivery);
      return;
    }
  }
  acceptDelivery(delivery: any): void {
    this.deliveryService
      .acceptDelivery(
        delivery._id
      )
      .subscribe({
        next: (response) => {
          delivery.status ='Accepted';
          this.startRiderLocation(delivery);
          this.drc.detectChanges();
        },
        error: (error) => {
          console.error(
            'ACCEPT DELIVERY ERROR:',
            error
          );
          alert(
            error.error?.message ||
            'Accept Delivery failed'
          );
        }

      });

  }


  startRiderLocation(delivery: any ): void {
    if (!navigator.geolocation) {
      alert(
        'Browser មិន support GPS'
      );
      return;
    }
    // ========================================
    // PREVENT DUPLICATE WATCH
    // ========================================
    if (this.watchId !== null) {
      return;
    }

    console.log(
      'START RIDER GPS'
    );



    this.watchId = navigator.geolocation
        .watchPosition(
          (position) => {
            const latitude =
              position.coords.latitude;
            const longitude =position.coords.longitude;
            delivery.currentLocation = {
              latitude:latitude,
              longitude:longitude
            };

   
            this.deliveryService
              .updateLocation(delivery._id,latitude,longitude
              )
              .subscribe({
                next: (response) => {
                  console.log('LOCATION UPDATED:',response);
                },
                error: (error) => {
                  console.error(
                    'LOCATION UPDATE ERROR:',
                    error
                  );

                }
              });
          },
          (error) => {
            console.error(
              'GPS ERROR:',
              error
            );


            if (error.code === 1) {
              alert(
                'សូម Allow Location Permission'
              );

            }


            if (
              error.code === 2) {
              console.error(
                'Location unavailable'
              );

            }


            if (error.code === 3) {
              console.error(
                'GPS timeout'
              );
            }
          },
          {enableHighAccuracy:true,
            maximumAge:5000,
            timeout:10000
          }
        );
  }

  pickupDelivery(delivery: any): void {
    this.deliveryService
      .pickupDelivery(delivery._id)
      .subscribe({
        next: (response) => {
         
          delivery.status ='PickedUp';
          this.drc.detectChanges();
        },
        error: (error) => {
          console.error(
            'PICKUP ERROR:',
            error
          );
          alert(
            error.error?.message ||'Pickup failed'
          );
        }
      });
  }

  // ==========================================
  // START DELIVERY
  // ==========================================
  startDelivery(
    delivery: any ): void {
    this.deliveryService
      .startDelivery(delivery._id)
      .subscribe({
        next: (response) => {
      
          delivery.status ='Delivering';
          this.drc.detectChanges();
        },
        error: (error) => {
          console.error(
            'START DELIVERY ERROR:',
            error
          );
          alert(
            error.error?.message ||'Start delivery failed');
        }
      });
  }

  completeDelivery(
    delivery: any): void {
    this.deliveryService
      .completeDelivery(delivery._id)
      .subscribe({
        next: (response) => {
          delivery.status ='Completed';
          this.drc.detectChanges();
          this.stopRiderLocation();
          
        },
        error: (error) => {
          console.error(
            'COMPLETE ERROR:',
            error
          );
          alert(
            error.error?.message ||'Complete delivery failed'
          );
        }
      });
  }


  openCustomerLocation(delivery: any): void {
    const address =delivery?.orderId?.deliveryAddress;
    if (!address || address.latitude == null ||address.longitude == null ) {
      alert('Customer Location មិនមាន');
      return;
    }
    const latitude =Number(  address.latitude);
    const longitude =Number(address.longitude);

    const url =`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(
      url,
      '_blank'
    );
  }

  openDeliveryMap(delivery: any): void {
    const rider =delivery?.currentLocation;
    const customer =
      delivery?.orderId?.deliveryAddress;

    if (!rider ||rider.latitude == null ||rider.longitude == null) {
      alert('មិនទាន់រកឃើញទីតាំងរបស់ Rider');
      return;
    }



    if ( !customer || customer.latitude == null ||customer.longitude == null) {
      alert('មិនទាន់មាន Customer Location');
      return;
    }
    const riderLat =Number(rider.latitude);
    const riderLng =Number(rider.longitude);
    const customerLat = Number(customer.latitude);
    const customerLng = Number(customer.longitude);

    const distanceMeters =this.calculateDistance(
        riderLat,
        riderLng,
        customerLat,
        customerLng
      );
    let distanceText = '';
    if (distanceMeters >= 1000) {
      distanceText =(distanceMeters / 1000).toFixed(2) + ' km';
    } else {
      distanceText = Math.round(  distanceMeters
        ) + ' m';
    }
    this.dialog.open(RiderMapDialog,
      {
        width: '900px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        data: {
          riderLocation: {
            latitude:riderLat,
            longitude:riderLng
          },
          customerLocation: {
            latitude:customerLat,
            longitude: customerLng
          },
          distance:distanceText,
          delivery:delivery
        }

      }

    );

  }
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number

  ): number {
    const R =6371000;
    const dLat =
      this.toRadians(
        lat2 - lat1
      );
    const dLon =
      this.toRadians(
        lon2 - lon1
      );
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRadians(lat1)) *
      Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c =2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );
    return R * c;
  }
  toRadians(degrees: number ): number {
    return (degrees *Math.PI /180);
  }
  stopRiderLocation(): void {
    if (
      this.watchId !== null
    ) {
      navigator.geolocation
        .clearWatch(
          this.watchId
        );
      this.watchId =null;
    }

  }
  ngOnDestroy(): void {
    this.stopRiderLocation();

  }

}
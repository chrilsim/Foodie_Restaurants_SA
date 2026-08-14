import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usdToKhr',
  standalone: true
})
export class UsdToKhrPipe implements PipeTransform {

  transform(value: number, rate: number = 4000): string {
    const khr = value * rate;

    return new Intl.NumberFormat('km-KH').format(khr) + ' ៛';
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uptimeFixed'
})
export class UptimeFixedPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value < 0) {
      return 'N/A';
    }
    if (value < 60) {
      return '00:00:' + (value < 10 ? '0' + value : value);
    }
    const secs = value % 60;
    value = Math.floor(value / 60);
    if (value < 60) {
      return '00:' + (value < 10 ? '0' + value : value) + ':' + (secs < 10 ? '0' + secs : secs);
    }
    const mins = value % 60;
    value = Math.floor(value / 60);
    if (value < 24) {
      return (value < 10 ? '0' + value : value) + ':' + (mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
    }
    const horas = value % 24;
    value = Math.floor(value / 24);
    return value + 'd - ' + horas + ':' + (mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
  }

}

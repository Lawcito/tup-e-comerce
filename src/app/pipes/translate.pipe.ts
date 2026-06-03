import { Pipe, PipeTransform } from '@angular/core';
import i18next from '../i18n';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  transform(key: string): string {
    return i18next.t(key);
  }
}

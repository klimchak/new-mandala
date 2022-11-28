import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'RemoveHtml'})
export class RemoveHtmlPipe implements PipeTransform {
  public transform(value: string): string {
    return value.replace(/<[^>]+>/gm, '');
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'apifilter'
})
export class ApifilterPipe implements PipeTransform {

  transform(apis: any, searchText: any): any {
    if (!searchText) {
      return apis;
    }
    const tempApis = [];
    for (const api of apis) {
      if (api.title && api.title.toLowerCase().includes(searchText.toLowerCase())) {
        tempApis.push(api);
      }
    }
    return tempApis;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryfilter'
})
export class CategoryfilterPipe implements PipeTransform {

  transform(categories: any, searchText: any): any {
    if (!searchText || searchText.length === 0) {
      return categories;
    }
    let tempCategories = JSON.parse(JSON.stringify(categories));
    let filteredCategories = [];
    for (let category of tempCategories) {
      let categoryApis = [];
      for (let api of category.api_list){
        if ((api.category && api.category.toLowerCase().includes(searchText.toLowerCase()))  ||
          (api.title.toLowerCase().includes(searchText.toLowerCase()))) {
            categoryApis.push(api);
        }
      }
      if (categoryApis.length > 0) {
        category.api_list = categoryApis;
        filteredCategories.push(category);
      }
    }
    return filteredCategories;
  }
}

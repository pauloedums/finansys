import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';
import { Component, OnInit } from '@angular/core';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.sass']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  constructor(
    private categoryService: CategoryService,
    ) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteCategory(category) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
    this.categoryService.delete(category.id).subscribe(
      () => this.categories = this.categories.filter(el => el !== category),
      () => alert('Erro ao tentar excluir!')
    );
    }
  }

}

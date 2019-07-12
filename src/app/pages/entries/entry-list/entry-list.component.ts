import { Entry } from './../shared/entry.model';
import { EntryService } from './../shared/entry.service';
import { Component, OnInit } from '@angular/core';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.sass']
})
export class EntryListComponent implements OnInit {
  entries: Entry[] = [];
  constructor(
    private entryService: EntryService,
    ) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(
      entries => this.entries = entries,
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteEntry(entry) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
    this.entryService.delete(entry.id).subscribe(
      () => this.entries = this.entries.filter(el => el !== entry),
      () => alert('Erro ao tentar excluir!')
    );
    }
  }

}

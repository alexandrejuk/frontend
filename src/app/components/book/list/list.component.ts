import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BookService } from '../../../core/services/book/book.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  books: LocalDataSource;
  settings: any;

  constructor(
    private _scBook: BookService,
    private _sanitizer: DomSanitizer,
    private _router: Router) {
  }

  getCheckBoxTable(value: boolean = false) {
    if (value) {
      return '<input type="checkbox" disabled checked>';
    } else {
      return '<input type="checkbox" disabled>';
    }
  }

  ngOnInit() {
    this._scBook.getAll().subscribe(resp =>
      this.books =  new LocalDataSource(resp['items'])
    );

    const btnDelete = '<span class="btn btn-danger btn-sm"> <i class="fa fa-trash"></i> </span>';
    const btnEdit = '<span class="btn btn-info btn-sm"> <i class="fa fa-edit"></i> </span>';

    this.settings = {
      mode: 'inline',
      hideSubHeader: true,
      columns: {
        title: {
          title: 'Titulo',
          filter: false
        },
        author: {
          title: 'Autor',
          filter: false
        },
        name: {
          title: 'Doador',
          filter: false
        },
        phone: {
          title: 'Telefone',
          filter: false
        },
        approved: {
          title: 'Visível',
          filter: false,
          type: 'html',
          valuePrepareFunction: value =>
            this._sanitizer.bypassSecurityTrustHtml(this.getCheckBoxTable(value)),
        }
      },
      actions: {
        delete: false,
        edit: false,
        add: false,
        update: false,
        custom: [
          {
            name: 'edit',
            title: btnEdit,
          },
          {
            name: 'delete',
            title: btnDelete,
          },
        ],
        position: 'right', // left|right
      },
    };
  }

  onSearch(query: string = '') {
    if (!query) {
      this.books.reset();
    } else {
      this.books.setFilter([
        // fields we want to include in the search
        {
          field: 'title',
          search: query
        },
        {
          field: 'author',
          search: query
        },
        {
          field: 'name',
          search: query
        },
        {
          field: 'phone',
          search: query
        }
      ], false);
    }
  }

  onCustom(event) {
    if (event.action === 'delete') {
      this._scBook.delete(event.data.id).subscribe(resp => {
        if (resp['success']) {
          this.books.remove(event.data);
        }
      });
    } else {
      this._router.navigate(['book/form']);
    }
  }
}

import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService, Word } from './app.service';
import { Component, OnInit } from '@angular/core';
import { AppStore } from './app.store';

@Component({
  selector: 'hanzii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppStore, AppService, NzMessageService],
})
export class AppComponent implements OnInit {
  constructor(private readonly _store: AppStore) {}

  readonly vm$ = this._store.vm$;
  keyword = '';
  words: Word[] = [];
  year = new Date();

  ngOnInit(): void {
    this._store.loadAllWords();
  }

  onSearch(keyword: string) {
    if (keyword) {
      this._store.loadSearchResults(keyword);
      this.keyword = keyword;
    } else {
      this._store.loadAllWords();
    }
  }
}

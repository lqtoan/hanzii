import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { AppService, Word } from './app.service';

const DEFAULT_DEBOUNCE_TIME = 400;

export interface AppState {
  gettingStatus: string | null;
  words: Word[];
  keyword: string;
  total: number | null;
}

const initialState = {
  gettingStatus: null,
  words: [],
  keyword: '',
  total: null,
};

@Injectable()
export class AppStore extends ComponentStore<AppState> {
  constructor(private readonly _service: AppService, private readonly _message: NzMessageService) {
    super(initialState);
  }
  readonly vm$ = this.select(
    ({ gettingStatus, words, keyword, total }) => ({
      isLoading: gettingStatus === 'loading',
      isSuccess: gettingStatus === 'success',
      isFail: gettingStatus === 'fail',
      words,
      keyword,
      total,
    }),
    {
      debounce: true,
    }
  );

  //#region Updater
  // readonly updateCanEdit = this.updater<boolean>(
  //   (state, isCanEdit): DictionaryState => ({
  //     ...state,
  //     isCanEdit
  //   })
  // );
  //#region

  //#region Effect
  readonly loadAllWords = this.effect(($) =>
    $.pipe(
      debounceTime(400),
      tap(() => this.patchState({ gettingStatus: 'loading' })),
      switchMap(() =>
        this._service.getAllWords().pipe(
          tapResponse(
            (data) => {
              this.patchState({
                keyword: '',
                words: data,
                total: null,
                gettingStatus: 'success',
              });
            },
            (err: HttpErrorResponse) => {
              this.patchState({ gettingStatus: 'fail' });
              this._message.error(err.message);
            }
          ),
          finalize(() => this.patchState({ gettingStatus: null }))
        )
      )
    )
  );

  readonly loadSearchResults = this.effect<string>(($) =>
    $.pipe(
      debounceTime(DEFAULT_DEBOUNCE_TIME),
      tap(() => this.patchState({ gettingStatus: 'loading' })),
      switchMap((param) =>
        this._service.search(param).pipe(
          tapResponse(
            (data) => {
              this.patchState({ keyword: param, words: data, total: data.length, gettingStatus: 'success' });
            },
            (err: HttpErrorResponse) => {
              this.patchState({ gettingStatus: 'fail' });
              this._message.error(err.message);
            }
          ),
          finalize(() => {
            this.patchState({ gettingStatus: null });
          })
        )
      )
    )
  );
  //#region
}

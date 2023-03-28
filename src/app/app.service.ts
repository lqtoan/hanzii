import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Word {
  wordId: string;
  // _id: string; // Auto gen by MongoDB
  display: string;
  pinyin: string;
  chinaVietnamWord: string;
  type: string;
  define: string;
  hsk: string;
  reference: string;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;
}

@Injectable()
export class AppService {
  constructor(private readonly _httpClient: HttpClient) {}

  private API = 'https://super-chinese.cyclic.app/api/words';

  getAllWords(): Observable<Word[]> {
    return this._httpClient.get<Word[]>(`${this.API}`);
  }

  search(keyword?: string) {
    return this._httpClient.get<Word[]>(`${this.API}/search?keyword=${keyword}`);
  }
}

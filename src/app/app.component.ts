import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AppService, Word } from './app.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStore } from './app.store';
import HanziWriter from 'hanzi-writer';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'hanzii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppStore, AppService, NzMessageService, NzNotificationService],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private readonly _store: AppStore, private readonly _notificationService: NzNotificationService) {}

  readonly vm$ = this._store.vm$;
  keyword = '';
  year = new Date();
  timeoutId: NodeJS.Timeout | undefined;
  readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this._store.vm$.pipe(takeUntil(this.destroy$)).subscribe((vm) => {
      // console.log(vm);
      if (vm.isSuccess) {
        this._notificationService.create('info', 'Hướng dẫn', 'Bấm vào mỗi dòng để xem cách viết chữ', {
          nzDuration: 5000,
          nzClass: 'notification',
        });
      }
    });

    this._store.loadAllWords();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(keyword: string) {
    if (keyword) {
      this._store.loadSearchResults(keyword);
      this.keyword = keyword;
    } else {
      this._store.loadAllWords();
    }
  }

  onViewCharacter(word: Word) {
    this._store.patchState({ selectedWord: word, gettingStatus: null });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    for (let i = 0; i < word.display.length; i++) {
      this.timeoutId = setTimeout(() => {
        HanziWriter.create('writer', word.display.charAt(i), {
          width: 100,
          height: 100,
          padding: 5,
          strokeAnimationSpeed: 2, // x normal speed
          delayBetweenStrokes: 100, // milliseconds
          radicalColor: '#337ab7', // blue
          delayBetweenLoops: 4000,
        }).loopCharacterAnimation();

        if ('IntersectionObserver' in window) {
          // const options = {
          //   root: document.querySelector('#scrollArea'),
          //   rootMargin: '0px',
          //   threshold: 1.0,
          // };

          const observer = new IntersectionObserver((entries) =>
            entries.forEach((entry) => {
              if (!entry.isIntersecting) this._store.patchState({ selectedWord: null });
            })
          );

          document.querySelectorAll('#writer').forEach((item) => {
            observer.observe(item);
          });
        }
      }, i * 4000);
    }
  }
}

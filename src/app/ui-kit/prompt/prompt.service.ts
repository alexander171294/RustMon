import { EventEmitter, Injectable } from '@angular/core';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  public readonly onPromptOpened = new EventEmitter<PromptData>();
  private readonly onClose = new EventEmitter<string>();

  constructor() { }

  public openPrompt(d: PromptData) {
    return new Promise((res, rej) => {
      this.onPromptOpened.emit(d);
      this.onClose.pipe(
        first(),
      ).subscribe(d => {
        if(d) {
          res(d);
        } else {
          rej();
        }
      });
    });
  }

  public close(data?: string) {
    this.onClose.emit(data);
  }
}

export class PromptData {
  promptName: string;
  promptPlaceholder?: string;
  constructor(name: string, placeholder?: string) {
    this.promptName = name;
    this.promptPlaceholder = placeholder;
  }
}

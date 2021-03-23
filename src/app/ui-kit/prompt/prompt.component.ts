import { PromptService } from './prompt.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {

  visible: boolean;
  promptName: string;
  promptPlaceholder: string = '';
  promptInput: string;

  constructor(private pSrv: PromptService) {
    this.pSrv.onPromptOpened.subscribe(d => {
      this.promptName = d.promptName;
      this.promptPlaceholder = d.promptPlaceholder ? d.promptPlaceholder : '';
      this.visible = true;
      this.promptInput = '';
    });
  }

  ngOnInit() {
  }

  cancel() {
    this.pSrv.close();
  }

  ok() {
    this.pSrv.close(this.promptInput);
  }

}

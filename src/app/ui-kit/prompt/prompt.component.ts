import { PromptService } from './prompt.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {

  visible: boolean = false;
  promptName: string;
  promptPlaceholder: string = '';
  promptInput: string;

  constructor(private pSrv: PromptService) {

  }

  ngOnInit() {
    this.pSrv.onPromptOpened.subscribe(d => {
      this.promptName = d.promptName;
      this.promptPlaceholder = d.promptPlaceholder ? d.promptPlaceholder : '';
      this.visible = true;
      this.promptInput = '';
    });
  }

  cancel() {
    this.pSrv.close();
    this.visible = false;
  }

  ok() {
    this.pSrv.close(this.promptInput);
    this.visible = false;
  }

}

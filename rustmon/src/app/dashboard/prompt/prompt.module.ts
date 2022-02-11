import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptComponent } from './prompt.component';



@NgModule({
  declarations: [PromptComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [PromptComponent]
})
export class PromptModule { }

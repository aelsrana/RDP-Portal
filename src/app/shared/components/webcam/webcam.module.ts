import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamComponent } from './webcam.component';

@NgModule({
    imports: [CommonModule],
    declarations: [WebcamComponent],
    exports: [WebcamComponent]
})
export class WebcamModule { }
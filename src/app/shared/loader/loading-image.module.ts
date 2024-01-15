import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingImageComponent } from './loading-image.component';
import { LoadingSpinnerComponent } from 'src/app/shared/loader/loading-spinner.component';

@NgModule({
    imports: [CommonModule],
    declarations: [LoadingImageComponent, LoadingSpinnerComponent],
    exports: [LoadingImageComponent, LoadingSpinnerComponent]
})
export class LoadingImageModule { }
/**
 * this module is intended to be included only required componants from angular material library
 */
import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule, MatDatepicker} from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatChipsModule} from '@angular/material/chips';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

// add only required modules
@NgModule({
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatCheckboxModule, MatTooltipModule,
    MatToolbarModule, MatIconModule,MatExpansionModule, MatFormFieldModule,MatCardModule, MatButtonModule, MatDatepickerModule,
    MatDividerModule, MatGridListModule, MatSelectModule, MatProgressSpinnerModule, MatDialogModule, MatProgressBarModule, MatNativeDateModule],
  exports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatCheckboxModule,MatTooltipModule, MatChipsModule,
    MatToolbarModule, MatIconModule, MatExpansionModule, MatFormFieldModule,MatCardModule, MatButtonModule, MatDatepickerModule,
    MatDividerModule, MatGridListModule, MatSelectModule, MatProgressSpinnerModule, MatDialogModule,MatProgressBarModule, MatNativeDateModule],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class CustomMaterialModule { }

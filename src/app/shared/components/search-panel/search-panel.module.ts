import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomMaterialModule } from "src/app/custom-material";
import { SearchPanelComponent } from "src/app/shared/components/search-panel/search-panel.component";
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
    imports: [CommonModule, ReactiveFormsModule, CustomMaterialModule, NgSelectModule],
    declarations: [SearchPanelComponent],
    exports:[SearchPanelComponent]
})

export class SearchPanelModule {}
import { RouterModule }  from '@angular/router';
import { RemittanceEditComponent } from 'src/app/dashboard/remittance-edit/remittance-edit.component';

export const remittanceEditRoutes = RouterModule.forChild([
    {
        path: '',
        children:
        [
            {
                path: '',
                component: RemittanceEditComponent
            }
        ]
    }
]);

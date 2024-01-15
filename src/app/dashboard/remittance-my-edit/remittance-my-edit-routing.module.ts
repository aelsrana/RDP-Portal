import { RouterModule }  from '@angular/router';
import { RemittanceMyEditComponent } from 'src/app/dashboard/remittance-my-edit/remittance-my-edit.component';
import { RemittanceMyEditDetailComponent } from 'src/app/dashboard/remittance-my-edit/remittance-my-edit-detail.component';

export const remittanceMyEditRoutes = RouterModule.forChild([
    {
        path: '',
        children:
        [
            {
                path: '',
                component: RemittanceMyEditComponent
            },
            {
                path: ':oid',
                component: RemittanceMyEditDetailComponent
            }
        ]
    }
]);

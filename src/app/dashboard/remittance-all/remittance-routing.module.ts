import { RouterModule }  from '@angular/router';
import { RemittanceComponent } from 'src/app/dashboard/remittance-all/remittance.component';
import { RemittanceDetailComponent } from 'src/app/dashboard/remittance-all/remittance-detail.component';

export const remittanceRoutes = RouterModule.forChild([
    {
        path: '',
        children:
        [
            {
                path: '',
                component: RemittanceComponent
            },
            {
                path: ':oid',
                component: RemittanceDetailComponent
            }
        ]
    }
]);

import { RouterModule }  from '@angular/router';
import { RemittanceMyApproveComponent } from 'src/app/dashboard/remittance-my-approve/remittance-my-approve.component';
import { RemittanceMyApproveDetailComponent } from 'src/app/dashboard/remittance-my-approve/remittance-my-approve-detail.component';

export const remittanceMyApproveRoutes = RouterModule.forChild([
    {
        path: '',
        children:
        [
            {
                path: '',
                component: RemittanceMyApproveComponent
            },
            {
                path: ':oid',
                component: RemittanceMyApproveDetailComponent
            }
        ]
    }
]);

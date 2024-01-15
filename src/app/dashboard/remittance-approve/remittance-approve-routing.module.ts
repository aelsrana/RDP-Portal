import { RouterModule }  from '@angular/router';
import { RemittanceApproveComponent } from 'src/app/dashboard/remittance-approve/remittance-approve.component';

export const remittanceApproveRoutes = RouterModule.forChild([
    {
        path: '',
        children:
        [
            {
                path: '',
                component: RemittanceApproveComponent
            }
        ]
    }
]);

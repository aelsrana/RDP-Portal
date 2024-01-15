import { RouterModule }  from '@angular/router';
import { RemittanceDisburseComponent } from 'src/app/dashboard/remittance-disburse/remittance-disburse.component';


export const remittanceDisburseRoutes = RouterModule.forChild([
    {
        path: '',
        children:
        [
            {
                path: '',
                component: RemittanceDisburseComponent
            }
        ]
    }
]);

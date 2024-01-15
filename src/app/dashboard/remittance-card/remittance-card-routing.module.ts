import { RemittanceCardComponent } from './remittance-card.component';
import { RemittanceCardDetailComponent } from './remittance-card-detail.component';
import { RouterModule }  from '@angular/router';

export const remittanceCardRoutes = RouterModule.forChild([
    {
        path: '',
        children:
        [
            {
                path: '',
                component: RemittanceCardComponent
            },
            {
                path: ':oid',
                component: RemittanceCardDetailComponent
            }
        ]
    }
]);

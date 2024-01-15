import { RouterModule }  from '@angular/router';
import { BsrInformationComponent }     from './bsr-information.component';

export const bsrInformationRoutes = RouterModule.forChild([
    {
        path: '',
        children:
        [
            {
                path: '',
                component: BsrInformationComponent
            }
        ]
    }
]);

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NavigationLinkComponent } from './navigation-link/navigation-link.component';
import { RoleBaseAuthGuard } from 'src/app/shared/services/role-auth-guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'dashboard'},
            { path: 'dashboard', component: NavigationLinkComponent },
            { path: 'dashboard/new-remittance-request', loadChildren: './bsr-information/bsr-information.module#BsrInformationModule',  canActivate: [RoleBaseAuthGuard]  },
            { path: 'dashboard/remittance-list', loadChildren: './remittance-all/remittance.module#RemittanceModule',  canActivate: [RoleBaseAuthGuard] },
            { path: 'dashboard/edit-remittance-request', loadChildren: './remittance-edit/remittance-edit.module#RemittanceEditModule',  canActivate: [RoleBaseAuthGuard] },
            { path: 'dashboard/my-edit-remittance-request', loadChildren: './remittance-my-edit/remittance-my-edit.module#RemittanceMyEditModule',  canActivate: [RoleBaseAuthGuard] },
            { path: 'dashboard/approve-remittance-request', loadChildren: './remittance-approve/remittance-approve.module#RemittanceApproveModule',  canActivate: [RoleBaseAuthGuard] },
            { path: 'dashboard/my-approve-remittance-request', loadChildren: './remittance-my-approve/remittance-my-approve.module#RemittanceMyApproveModule',  canActivate: [RoleBaseAuthGuard] },
            { path: 'dashboard/remit-card', loadChildren: './remittance-card/remittance-card.module#RemittanceCardModule',  canActivate: [RoleBaseAuthGuard] },
            { path: 'disburse-remittance-request', loadChildren: './remittance-disburse/remittance-disburse.module#RemittanceDisburseModule',  canActivate: [RoleBaseAuthGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared/guard/index';
import { DashboardModule } from './dashboard/dashboard.module';
import { RoleBaseAuthGuard } from 'src/app/shared/services/role-auth-guard';

const routes: Routes = [
    { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard]},
    { path: 'login', loadChildren: './login/login.module#LoginModule' },  
    { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule' },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: 'xpress-money', loadChildren: './xpress-money/xpress-money.module#XpressMoneyModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    // , { preloadingStrategy: PreloadAllModules }
    exports: [RouterModule]
})
export class AppRoutingModule {}

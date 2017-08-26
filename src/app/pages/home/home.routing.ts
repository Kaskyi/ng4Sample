import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeUserComponent } from 'app/pages/home/home-user/home-user.component';
import { HomeManagerComponent } from 'app/pages/home/home-manager/home-manager.component';
import { HomeGuestComponent } from 'app/pages/home/home-guest/home-guest.component';
import { HomeComponent } from 'app/pages/home/home.component';

import { GuestGuard } from 'app/guards/guest.guard';
import { UserGuard } from 'app/guards/user.guard';
import { ManagerGuard } from 'app/guards/manager.guard';

const adminRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: '', canActivate: [GuestGuard], component: HomeGuestComponent },
            { path: '', canActivate: [ManagerGuard], component: HomeManagerComponent },
            { path: '', canActivate: [UserGuard], component: HomeUserComponent }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes),
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRoutingModule { }

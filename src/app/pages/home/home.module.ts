
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { HomeComponent } from 'app/pages/home/home.component';
import { HomeManagerComponent } from 'app/pages/home/home-manager/home-manager.component';
import { HomeGuestComponent } from 'app/pages/home/home-guest/home-guest.component';
import { HomeUserComponent } from 'app/pages/home/home-user/home-user.component';
import { HomeRoutingModule } from 'app/pages/home/home.routing';

import { GuestGuard } from 'app/guards/guest.guard';
import { UserGuard } from 'app/guards/user.guard';
import { ManagerGuard } from 'app/guards/manager.guard';
import { AuthService } from 'app/services/auth.service';

@NgModule({
    declarations: [
        HomeComponent,
        HomeManagerComponent,
        HomeGuestComponent,
        HomeUserComponent
    ],
    imports: [
        FormsModule,
        HomeRoutingModule,
        TranslateModule
    ],
    providers: [
        GuestGuard,
        UserGuard,
        ManagerGuard,
        AuthService,
    ],
    bootstrap: []
})
export class HomeModule { }

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminlayoutComponent } from './layouts/adminlayout/adminlayout.component';
import { RoomFormComponent } from './rooms/room-form/room-form.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { AdmindashboardComponent } from './dashboard/admindashboard/admindashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminlayoutComponent,
        children: [
        {path : 'dashboard',component:AdmindashboardComponent},
        { path: 'rooms', component: RoomListComponent },
        { path: 'rooms/add', component: RoomFormComponent },
        { path: 'rooms/edit/:id', component: RoomFormComponent },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];

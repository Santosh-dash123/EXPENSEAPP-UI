import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminlayoutComponent } from './layouts/adminlayout/adminlayout.component';
import { RoomFormComponent } from './rooms/room-form/room-form.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { AdmindashboardComponent } from './dashboard/admindashboard/admindashboard.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { MemberMasterComponent } from './members/member-master/member-master.component';
import { AddMembersModalComponent } from './members/add-members-modal/add-members-modal.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'admin', component: AdminlayoutComponent,
        children: [
        {path : 'dashboard',component:AdmindashboardComponent},
        { path: 'rooms', component: RoomListComponent },
        { path: 'rooms/add', component: RoomFormComponent },
        { path: 'rooms/edit/:id', component: RoomFormComponent },
        { path: 'members', component: MemberMasterComponent },
        { path: 'members/add', component: AddMembersModalComponent },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];

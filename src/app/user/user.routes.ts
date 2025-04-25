import { Routes } from '@angular/router';
import { UserListComponent } from './components/list/user-list.component';
import { UserFormComponent } from './components/form/user-form.component';
import { AuthGuard } from '../core/guards/auth.guard';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component: UserListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'new',
        component: UserFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'edit/:id',
        component: UserFormComponent,
        canActivate: [AuthGuard]
    }
];

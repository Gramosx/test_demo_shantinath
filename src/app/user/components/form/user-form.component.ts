import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule]
})
export class UserFormComponent implements OnInit {
    user: User = {
        name: '',
        email: '',
        role: 'user'
    };

    isEditMode = false;
    loading = false;
    error = '';

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const userId = this.route.snapshot.paramMap.get('id');

        if (userId) {
            this.isEditMode = true;
            this.loadUser(+userId);
        }
    }

    loadUser(id: number): void {
        this.loading = true;
        this.userService.getUser(id).subscribe({
            next: (user) => {
                if (user) {
                    this.user = user;
                } else {
                    this.error = 'User not found';
                    this.router.navigate(['/users']);
                }
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Failed to load user';
                this.loading = false;
                console.error('Error loading user:', error);
            }
        });
    }

    onSubmit(): void {
        this.loading = true;
        this.error = '';

        const action = this.isEditMode
            ? this.userService.updateUser(this.user)
            : this.userService.createUser(this.user);

        action.subscribe({
            next: () => {
                this.router.navigate(['/users']);
            },
            error: (error) => {
                this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} user`;
                this.loading = false;
                console.error('Error saving user:', error);
            }
        });
    }
}

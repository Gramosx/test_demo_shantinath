import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class UserListComponent implements OnInit {
    users: User[] = [];
    loading = false;
    error = '';

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.userService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Failed to load users. Please try again.';
                this.loading = false;
                console.error('Error loading users:', error);
            }
        });
    }

    deleteUser(id: number): void {
        if (confirm('Are you sure you want to delete this user?')) {
            this.userService.deleteUser(id).subscribe({
                next: (success) => {
                    if (success) {
                        this.users = this.users.filter(user => user.id !== id);
                    } else {
                        this.error = 'Failed to delete user';
                    }
                },
                error: (error) => {
                    this.error = 'Failed to delete user. Please try again.';
                    console.error('Error deleting user:', error);
                }
            });
        }
    }
}

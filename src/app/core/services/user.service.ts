import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../types/models';
import { UserRole } from '../types/enums';

const STORAGE_KEY = 'tms_users';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor() {
        this.initializeDemoUsers();
    }

    getUsers(): Observable<User[]> {
        const users = this.getUsersFromStorage();
        return of(users);
    }

    getUser(id: string): Observable<User | null> {
        const users = this.getUsersFromStorage();
        const user = users.find(u => u.id === id);
        return of(user || null);
    }

    createUser(userData: Partial<User>): Observable<User> {
        const users = this.getUsersFromStorage();
        const now = new Date();
        const newUser: User = {
            id: this.generateId(),
            username: userData.username || '',
            fullName: userData.fullName || '',
            email: userData.email || '',
            role: userData.role || UserRole.USER,
            isActive: true,
            createdAt: now,
            updatedAt: now
        };
        users.push(newUser);
        this.saveUsersToStorage(users);
        return of(newUser);
    }

    updateUser(id: string, userData: Partial<User>): Observable<User | null> {
        const users = this.getUsersFromStorage();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) {
            return of(null);
        }
        const updatedUser = {
            ...users[index],
            ...userData,
            updatedAt: new Date()
        };
        users[index] = updatedUser;
        this.saveUsersToStorage(users);
        return of(updatedUser);
    }

    deleteUser(id: string): Observable<boolean> {
        const users = this.getUsersFromStorage();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) {
            return of(false);
        }
        users.splice(index, 1);
        this.saveUsersToStorage(users);
        return of(true);
    }

    private getUsersFromStorage(): User[] {
        const usersJson = localStorage.getItem(STORAGE_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    }

    private saveUsersToStorage(users: User[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private initializeDemoUsers(): void {
        const users = this.getUsersFromStorage();
        if (users.length === 0) {
            const now = new Date();
            const demoUsers: User[] = [
                {
                    id: '1',
                    username: 'admin',
                    fullName: 'Admin User',
                    email: 'admin@example.com',
                    role: UserRole.ADMIN,
                    isActive: true,
                    createdAt: now,
                    updatedAt: now
                },
                {
                    id: '2',
                    username: 'superadmin',
                    fullName: 'Super Admin',
                    email: 'superadmin@example.com',
                    role: UserRole.SUPER_ADMIN,
                    isActive: true,
                    createdAt: now,
                    updatedAt: now
                },
                {
                    id: '3',
                    username: 'user',
                    fullName: 'Regular User',
                    email: 'user@example.com',
                    role: UserRole.USER,
                    isActive: true,
                    createdAt: now,
                    updatedAt: now
                }
            ];
            this.saveUsersToStorage(demoUsers);
        }
    }
}

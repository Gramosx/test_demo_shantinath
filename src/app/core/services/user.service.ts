import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private users: User[] = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    constructor() { }

    getUsers(): Observable<User[]> {
        return of(this.users).pipe(delay(500));
    }

    getUser(id: number): Observable<User | undefined> {
        const user = this.users.find(u => u.id === id);
        return of(user).pipe(delay(500));
    }

    createUser(user: User): Observable<User> {
        const newUser = {
            ...user,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(newUser);
        return of(newUser).pipe(delay(500));
    }

    updateUser(user: User): Observable<User> {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            const updatedUser = {
                ...this.users[index],
                ...user,
                updatedAt: new Date()
            };
            this.users[index] = updatedUser;
            return of(updatedUser).pipe(delay(500));
        }
        throw new Error('User not found');
    }

    deleteUser(id: number): Observable<boolean> {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return of(true).pipe(delay(500));
        }
        return of(false).pipe(delay(500));
    }

    private generateId(): number {
        return this.users.length > 0
            ? Math.max(...this.users.map(user => user.id || 0)) + 1
            : 1;
    }
}

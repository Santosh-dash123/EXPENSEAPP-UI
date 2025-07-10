import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })

export class UserService{
    private _userName = new BehaviorSubject<string | null>(localStorage.getItem('userName'));
    private _userType = new BehaviorSubject<number | null>(Number(localStorage.getItem('userType')));

    private baseUrl = 'https://localhost:7020';

    constructor(private http: HttpClient) { }

    CheckLogin(user : Partial<User>): Observable<ApiResponse<User>> {
        debugger;
        return this.http.post<ApiResponse<User>>(`${this.baseUrl}/CheckLogin`,user);
    }

    //Code for store data user name or anything in localstorage
    get userName$(): Observable<string | null> {
        debugger;
        return this._userName.asObservable();
    }

    setUserName(name: string) {
        debugger;
        localStorage.setItem('userName', name);
        this._userName.next(name);
    }

    get userType$(): Observable<number | null> {
        return this._userType.asObservable();
    }

    setUserType(name: number) {
        localStorage.setItem('userType', name.toString());
        this._userType.next(name);
    }

    clearUser() {
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        this._userName.next(null);
    }
}
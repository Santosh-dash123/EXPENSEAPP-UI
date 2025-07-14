import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';
import { AppConstants } from '../constants/common.model';

@Injectable({ providedIn: 'root' })

export class UserService{
    private _userName = new BehaviorSubject<string | null>(localStorage.getItem('userName'));
    private _userType = new BehaviorSubject<number | null>(Number(localStorage.getItem('userType')));
    private _userId = new BehaviorSubject<number | null>(Number(localStorage.getItem('userId')));

    private baseUrl = AppConstants.API_BASE_URL;

    constructor(private http: HttpClient) { }

    CheckLogin(user : Partial<User>): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(`${this.baseUrl}/CheckLogin`,user);
    }

    userRegistration(user: User): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(`${this.baseUrl}/AddUser`, user);
    }

    //Code for store data user name or anything in localstorage
    get userName$(): Observable<string | null> {
        return this._userName.asObservable();
    }

    setUserName(name: string) {
        localStorage.setItem('userName', name);
        this._userName.next(name);
    }

     get userId$(): Observable<number | null> {
        return this._userId.asObservable();
    }

    setUserId(name: number) {
        localStorage.setItem('userId', name.toString());
        this._userId.next(name);
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
        localStorage.removeItem('userId');
        this._userName.next(null);
    }
}
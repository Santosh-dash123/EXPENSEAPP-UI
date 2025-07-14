import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../constants/common.model';
import { Observable } from 'rxjs';
import { getroomownerdto } from '../models/getroomownerdto.model';
import { worktypemst } from '../models/worktypemst.model';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response.model';
import { usertype } from '../models/usertype.model';

@Injectable({providedIn:'root'})
export class MasterService{
    private baseUrl = AppConstants.API_BASE_URL;

    constructor(private http: HttpClient) { }

    getRoomOwner():Observable<ApiResponse<getroomownerdto[]>>{
        debugger;
        return this.http.get<ApiResponse<getroomownerdto[]>>(`${this.baseUrl}/GetRoomOwner`);
    }
    getWorkTypeMaster():Observable<worktypemst[]>{
        debugger;
        return this.http.get<worktypemst[]>(`${this.baseUrl}/GetWorkType`);
    }
    getUserType():Observable<ApiResponse<usertype[]>>{
        debugger;
        return this.http.get<ApiResponse<usertype[]>>(`${this.baseUrl}/GetUserType`);
    }
}
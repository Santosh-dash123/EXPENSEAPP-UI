import { Injectable } from "@angular/core";
import { AppConstants } from '../constants/common.model';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ApiResponse } from "../models/api-response.model";
import { emailverification } from "../models/emailverification.model";

@Injectable({providedIn:'root'})
export class HelperService{
    private baseUrl = AppConstants.API_BASE_URL;

    constructor(private http: HttpClient) { }   

    sendOtp(data: emailverification): Observable<ApiResponse<emailverification>> {
        return this.http.post<ApiResponse<emailverification>>(`${this.baseUrl}/SendOtp`, data);
    }

    verifyOtp(data: emailverification): Observable<ApiResponse<emailverification>> {
        return this.http.post<ApiResponse<emailverification>>(`${this.baseUrl}/VerifyOtp`, data);
    }
}
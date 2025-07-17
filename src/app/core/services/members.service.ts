import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Members } from '../models/members.model'; // Adjust path as needed
import { AppConstants } from '../constants/common.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private baseUrl = `${AppConstants.API_BASE_URL}`; 

  constructor(private http: HttpClient) {}

  getAllMembers(roomOwnerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllMembers/${roomOwnerId}`);
  }

  addMembers(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddMembers`, formData);
  }

  updateMember(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/UpdateMembers`, formData);
  }

  deleteMember(id: number): Observable<any> {
    const params = new HttpParams().set('Id', id.toString());
    return this.http.post(`${this.baseUrl}/DeleteMembers`, null, { params });
  }
}

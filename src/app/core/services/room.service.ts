import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Room } from '../models/room.model';
import { AppConstants } from '../constants/common.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private baseUrl = AppConstants.API_BASE_URL;

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Room[]> {
    debugger;
    return this.http.get<Room[]>(`${this.baseUrl}/GetRooms`);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.baseUrl}/GetParticularRoom/${id}`);
  }

  addRoom(formData: FormData): Observable<ApiResponse<Room>> {
    return this.http.post<ApiResponse<Room>>(`${this.baseUrl}/AddRooms`, formData);
  }

  updateRoom(formData: FormData): Observable<ApiResponse<Room>> {
    return this.http.post<ApiResponse<Room>>(`${this.baseUrl}/UpdateRoom`, formData);
  }

  deleteRoom(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/DeleteRoom/${id}`);
  }
}

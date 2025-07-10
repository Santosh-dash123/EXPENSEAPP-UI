import { Component } from '@angular/core';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  imports: [CommonModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent {
  rooms: Room[] = [];

    constructor(private roomService: RoomService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.roomService.getRooms().subscribe({
        next: (data) => this.rooms = data,
        error: (err) => console.error('Error fetching rooms:', err)
      });
    }

    navigateToAddRoom()
    {
      this.router.navigate(['/admin/rooms/add']); //Directly Navigate To Room Form Component
    }

    editRoom(id: number): void {
      this.router.navigate(['/admin/rooms/edit', id]);
    } 
    deleteRoom(id:any)
    {

    }
}

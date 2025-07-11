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
  isDelete = false ;

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
    deleteRoom(id: number): void {
      if (id != null && id !== 0) {
        const confirmDelete = confirm("Are you sure to delete this room?");
        if (confirmDelete) {
          this.roomService.deleteRoom(id).subscribe({
            next: (value) => {
              if (value.data === true) {
                alert(value.statusMessage);
                this.ngOnInit(); 
              }
            },
            error: (error) => {
              alert("Error deleting room: " + error.statusMessage);
            }
          });
        }
      }
    }

}

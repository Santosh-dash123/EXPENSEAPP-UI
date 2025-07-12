import { Component } from '@angular/core';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppConstants } from '../../core/constants/common.model';
import Swal from 'sweetalert2';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-room-list',
  imports: [CommonModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent {
  selectedImageUrl:string = '';
  rooms: Room[] = [];
  isDelete = false ;
  userId : number | null = null;

    constructor(private roomService: RoomService,
      private router: Router,
      private userService: UserService
    ) {}


    ngOnInit(): void {
      this.userService.userId$.subscribe({
        next: (id) => {
          if (id !== null) {
            this.userId = id;
            this.roomService.getRooms(this.userId).subscribe({
              next: (data) => this.rooms = data,
              error: (err) => console.error('Error fetching rooms:', err)
            });
          } else {
            console.warn("User ID is null, cannot fetch rooms.");
          }
        },
        error: (err) => {
          console.error("Error getting user ID:", err);
        }
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
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you really want to delete this room?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.roomService.deleteRoom(id).subscribe({
              next: (value) => {
                if (value.data === true) {
                  Swal.fire('Deleted!', value.statusMessage, 'success');
                  this.ngOnInit();
                }
              },
              error: (error) => {
                Swal.fire('Error!', "Error deleting room: " + error.statusMessage, 'error');
              }
            });
          }
        });
      }
    }

    //Function for getting url of image
    getImageUrl(imagePath : string):string{
      return `${AppConstants.API_BASE_URL}/${imagePath}`
    }

    //Bind Image in a modal
    viewImage(imagePath : string):void{
      this.selectedImageUrl = this.getImageUrl(imagePath);
      const modalElement = document.getElementById("imageModal");
      if(modalElement)
      {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }
    
}

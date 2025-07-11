import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.scss'
})
export class RoomFormComponent implements OnInit {
  roomForm!: FormGroup;
  roomId: number | null = null;
  isEditMode = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private roomservice: RoomService
  ) {}

  formErrors = {
    name: '',
    address: '',
    rentDate: '',
    ammount: '',
  };

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      id:[0],
      name: ['', Validators.required],
      image: ['assets/images/abc.jpg'], // default image
      address: ['', Validators.required],
      rentDate: ['', Validators.required],
      ammount: [0, [Validators.required, Validators.min(1)]]
    });

    // Detect mode
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.roomId = +idParam;
        this.loadRoomData(this.roomId);
      }
    });
  }

  //First on edit button click call this method
  loadRoomData(id: number): void {
    this.roomservice.getRoomById(id).subscribe({
      next: (room) => {
        const formattedDate = room.rentDate ? room.rentDate.split('T')[0] : '';
        this.roomForm.patchValue({
          id: room.id,
          name: room.name,
          image: room.image,
          address: room.address,
          rentDate: formattedDate,
          ammount: room.ammount
        });
      },
      error: (err) => {
        console.error('Failed to fetch room details', err);
        alert('Failed to fetch room details.');
      }
    });
  }

  //This method for handle both add and edit operation 
  onRoomSubmit() {
    this.validateForm();
    if (this.roomForm.invalid) return;

    const roomData: Room = {
      id: this.roomId ?? 0,
      ...this.roomForm.value
    };

    if (this.isEditMode) {
      this.roomservice.updateRoom(roomData).subscribe({
        next: () => {
          alert('Room updated successfully!');
          this.router.navigate(['/admin/rooms']);
        },
        error: () => alert('Failed to update room.')
      });
    } else {
      this.roomservice.addRoom(roomData).subscribe({
        next: () => {
          alert('Room created successfully!');
          this.router.navigate(['/admin/rooms']);
        },
        error: () => alert('Failed to create room.')
      });
    }
  }

  //Validation Method for validate all the field
  validateForm() {
    this.formErrors = {
      name: '',
      address: '',
      rentDate: '',
      ammount: '',
    };

    if (this.roomForm.controls['name'].invalid)
      this.formErrors.name = 'Room Name is required';

    if (this.roomForm.controls['address'].invalid)
      this.formErrors.address = 'Address is required';

    if (this.roomForm.controls['rentDate'].invalid)
      this.formErrors.rentDate = 'Rent Date is required';

    if (this.roomForm.controls['ammount'].invalid)
      this.formErrors.ammount = 'Amount must be greater than 0';
  }

  navigateToListPage() {
    this.router.navigate(['/admin/rooms']);
  }
}


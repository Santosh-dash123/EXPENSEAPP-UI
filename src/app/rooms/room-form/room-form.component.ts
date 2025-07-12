import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';
import { CommonModule } from '@angular/common';
import { AppConstants } from '../../core/constants/common.model';
import Swal from 'sweetalert2';
import { UserService } from '../../core/services/user.service';

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
  selectedImageFile! : File;
  selectedImageUrl: string = '';
  userId: number|null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private roomservice: RoomService,
    private userservice: UserService
  ) {}

  formErrors = {
    name: '',
    image:'',
    address: '',
    rentDate: '',
    ammount: '',
  };

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      id:[0],
      name: ['', Validators.required],
      image: ['', Validators.required],
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

  //Get File
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
      this.roomForm.patchValue({ image: this.selectedImageFile.name });
      this.formErrors.image = '';
    } else {
      this.roomForm.patchValue({ image: '' });
    }
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
    this.userservice.userId$.subscribe({
        next: (id) => {
          if (id !== null) {
            this.userId = id;
          }
        },
        error: (err) => {
          console.error("Error getting user ID:", err);
        }
      });
    const formData = new FormData();
    formData.append("Id",this.roomForm.value.id.toString());
    formData.append("RoomOwnerId",this.userId != null ? this.userId.toString() : "");
    formData.append("Name",this.roomForm.value.name.toString());
    formData.append("Address",this.roomForm.value.address.toString());
    formData.append("RentDate",this.roomForm.value.rentDate.toString());
    formData.append("Ammount",this.roomForm.value.ammount.toString());
    if(this.roomForm.value.image != null)
    {
      formData.append("Image",this.selectedImageFile);
    }

    if (this.isEditMode) {
      this.roomservice.updateRoom(formData).subscribe({
        next: (data) => {
          Swal.fire('Updated', data.statusMessage, 'success');
          this.router.navigate(['/admin/rooms']);
        },
        error: () => alert('Failed to update room.')
      });
    } else {
      this.roomservice.addRoom(formData).subscribe({
        next: (data) => {
          Swal.fire('Created', data.statusMessage, 'success');
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
      image:'',
      address: '',
      rentDate: '',
      ammount: '',
    };

    if (this.roomForm.controls['name'].invalid)
      this.formErrors.name = 'Room Name is required';

    if (!this.selectedImageFile && !this.isEditMode) {
      this.formErrors.image = 'Image is required';
    }

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

  //Function for bind image if edit mode is active
    getImageUrl(imagePath: string): string {
      return `${AppConstants.API_BASE_URL}/${imagePath}`; 
    }

    viewImage(imagePath: string): void {
      this.selectedImageUrl = this.getImageUrl(imagePath);
      const modalElement = document.getElementById('imageModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }
}


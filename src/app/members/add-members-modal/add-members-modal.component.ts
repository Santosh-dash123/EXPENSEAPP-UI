import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Members } from '../../core/models/members.model';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../core/services/master.service';
import { roomDto } from '../../core/models/roomDto.model';
import { UserService } from '../../core/services/user.service';
import { worktypemst } from '../../core/models/worktypemst.model';
import { MembersService } from '../../core/services/members.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-members-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-members-modal.component.html',
  styleUrls: ['./add-members-modal.component.scss']
})
export class AddMembersModalComponent implements OnInit {
  members: Members[] = [];
  rooms:roomDto[]=[];
  workTypes: worktypemst[] = [];
  roomOwnerId:number=0;
  //State For Validate Errors   
  validateErrors : {[key:string]:string}[] = [];

  constructor(public masterService:MasterService, public userService:UserService, public memberservice:MembersService, public router:Router) {
    this.addMember();
  }

  //For first page load and for clear value
  getEmptyMember(): Members {
  const joiningDate = new Date().toISOString().split('T')[0];
    return {
      roomId: 0,
      name: '',
      gender: '0',
      adharCard: null,
      fatherName: '',
      image: null,
      joiningDate: joiningDate,
      address: '',
      email: '',
      phoneNumber: '',
      workType: 0,
      jobName: '',
      companyName: '',
      collegeName: '',
      courseName: '',
      status: 1
    };
  }

  addMember() {
    if (!this.validateAllMembers()) {
      return; 
    }
    this.members.push(this.getEmptyMember());
    this.validateErrors = [];
  }

  removeMember(index: number) {
    this.members.splice(index, 1);
    this.validateErrors.splice(index,1);//Remove also specific object erros
  }

  onFileChange(event: Event, index: number, field: 'adharCard' | 'image'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSizeInKB = 500;
      const maxSizeInBytes = maxSizeInKB * 1024;

      if (file.size > maxSizeInBytes) {
        if (!this.validateErrors[index]) {
          this.validateErrors[index] = {};
        }
        this.validateErrors[index][field] = `${field === 'adharCard' ? 'Adhar Card' : 'Image'} must be less than 500 KB.`;
        this.members[index][field] = null;  
        return;
      }

      this.members[index][field] = file;

      if (this.validateErrors[index]) {
        this.validateErrors[index][field] = '';
      }
    } else {
      this.members[index][field] = null;
    }
  }




  ngOnInit(): void {
    this.userService.userId$.subscribe(userId=>{
      if(userId != null)
      {
        this.roomOwnerId = userId;
      }
    })
    this.getRoomList();
    this.getWorkTypeMaster();
  }

  //Get All Room
  getRoomList():void{
      this.masterService.getAllRooms(this.roomOwnerId).subscribe({
        next:(data)=>{
          this.rooms = data.data;
        },
        error:(err)=>{
          console.error('Failed To Fetch Rooms!',err);
        }
      })
    }
  //Get Work Type Master
  getWorkTypeMaster():void{
    this.masterService.getWorkTypeMaster().subscribe({
      next:(data)=>{
        this.workTypes = data;
      },
      error:(error)=>{
        console.error('Failed To Work Type!',error);
      }
    })
  }

  //Clear All Field
  clearAllField(index:number)
  {
    this.members[index] = this.getEmptyMember();
  }
  //Method For Validate All Fields
  validateAllMembers(): boolean {
    let isValid = true;
    this.validateErrors = [];

    this.members.forEach((member, index) => {
      const errors: any = {};

      if (member.roomId === 0) {
        errors.roomId = 'Please select a room!';
        isValid = false;
      }
      if (!member.name?.trim()) {
        errors.name = 'Name is required!';
        isValid = false;
      }
      if (member.gender === '0') {
        errors.gender = 'Please select gender!';
        isValid = false;
      }
      if (!member.fatherName?.trim()) {
        errors.fatherName = "Father's name is required!";
        isValid = false;
      }
      if (!member.adharCard) {
        errors.adharCard = 'Adhar card is required!';
        isValid = false;
      }
      if (!member.image) {
        errors.image = 'Image is required!';
        isValid = false;
      }
      if (!member.joiningDate) {
        errors.joiningDate = 'Joining date is required!';
        isValid = false;
      }
      if (!member.address?.trim()) {
        errors.address = 'Address is required!';
        isValid = false;
      }
      if (!member.email?.trim()) {
        errors.email = 'Email is required!';
        isValid = false;
      }
      if (!member.phoneNumber?.trim()) {
        errors.phoneNumber = 'Phone number is required!';
        isValid = false;
      }
      if (member.workType === 0) {
        errors.workType = 'Please select work type!';
        isValid = false;
      }

      // Conditional fields
      if (member.workType == 1) {
        if (!member.collegeName?.trim()) {
          errors.collegeName = 'College name is required!';
          isValid = false;
        }
        if (!member.courseName?.trim()) {
          errors.courseName = 'Course name is required!';
          isValid = false;
        }
      }

      if (member.workType == 2) {
        if (!member.jobName?.trim()) {
          errors.jobName = 'Job name is required!';
          isValid = false;
        }
        if (!member.companyName?.trim()) {
          errors.companyName = 'Company name is required!';
          isValid = false;
        }
      }

      this.validateErrors.push(errors);
    });

    return isValid;
  }


  submitForm() {
    if (!this.validateAllMembers()) {
      return; 
    }
    const formData = new FormData();

    this.members.forEach((member, i) => {
      for (const key in member) {
        const value = member[key as keyof Members];
        if (value instanceof File) {
          formData.append(`MemberData[${i}].${key}`, value);
        } else {
          formData.append(`MemberData[${i}].${key}`, value ? value.toString() : '');
        }
        formData.append(`MemberData[${i}].roomOwnerId`,this.roomOwnerId ? this.roomOwnerId.toString() : '');
      }
      this.memberservice.addMembers(formData).subscribe({
        next:(res)=>{
          Swal.fire('Success', res.statusMessage, 'success');
          this.router.navigate(['/admin/members']);
        },
        error:(err)=>{
          Swal.fire('Error', err.statusMessage, 'error');
        }
      })
    });

    console.log('FormData:', formData);
  }
}

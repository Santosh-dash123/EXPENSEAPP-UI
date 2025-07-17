import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Members } from '../../core/models/members.model';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../core/services/master.service';
import { roomDto } from '../../core/models/roomDto.model';
import { UserService } from '../../core/services/user.service';
import { worktypemst } from '../../core/models/worktypemst.model';
import { error } from 'console';

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

  constructor(public masterService:MasterService, public userService:UserService) {
    this.addMember();
  }

  addMember() {
    this.members.push({
      roomId: 0,
      name: '',
      gender: '0',
      adharCard: null,
      fatherName: '',
      image: null,
      joiningDate: new Date(),
      address: '',
      email: '',
      phoneNumber: '',
      workType: 0,
      jobName: '',
      companyName: '',
      collegeName: '',
      courseName: '',
      status: 1
    });
  }

  removeMember(index: number) {
    this.members.splice(index, 1);
  }

  onFileChange(event: any, index: number, field: keyof Members) {
    const file = event.target.files[0];
    if (file) {
      this.members[index][field] = file;
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

  submitForm() {
    const formData = new FormData();

    this.members.forEach((member, i) => {
      for (const key in member) {
        const value = member[key as keyof Members];
        if (value instanceof File) {
          formData.append(`MemberData[${i}].${key}`, value);
        } else {
          formData.append(`MemberData[${i}].${key}`, value ? value.toString() : '');
        }
      }
    });

    console.log('FormData:', formData);
  }
}

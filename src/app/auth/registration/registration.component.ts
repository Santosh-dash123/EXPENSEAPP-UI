import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule,Router } from '@angular/router';
import { MasterService } from '../../core/services/master.service';
import { getroomownerdto } from '../../core/models/getroomownerdto.model';
import { CommonModule } from '@angular/common';
import { usertype } from '../../core/models/usertype.model';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  standalone:true,
  imports: [RouterLink,RouterModule,CommonModule,FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
    roomOwners: getroomownerdto[] = [];
    userTypes: usertype[] = [];

    //Form - Bound Object
    user:User = {
      id:0,
      name:'',
      email:'',
      phoneNumber:'',
      password:'',
      userType:0,
      roomownerid:0
    }

    //Variable For Handle All Errors
    errors:any={};

    constructor(private masterService:MasterService,private userService:UserService,private router:Router)
    {

    }
    ngOnInit(): void {
      debugger;
      this.getRoomOwnerList();
      this.getUserTypeList();
    }

    //Method for get room owner list
    getRoomOwnerList():void{
      this.masterService.getRoomOwner().subscribe({
        next:(data)=>{
          this.roomOwners = data.data;
        },
        error:(err)=>{
          console.error('Failed To Fetch Rooms!',err);
        }
      })
    }

    //Method for get user type
    getUserTypeList():void{
      this.masterService.getUserType().subscribe({
        next:(data)=>{
          this.userTypes = data.data;
        },
        error:(err)=>{
          console.error('Failed To Fetch User Type!',err);
        }
      })
    }

    //Method For Register User
    register():void
    {
      this.errors = {}; //Initially There is no errors ...

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[6-9]\d{9}$/;

      //Validation
      if (!this.user.name) this.errors.name = 'Name Is Required!';
      if (!emailRegex.test(this.user.email)) {
        this.errors.email = 'Give Valid Email Address!';
      } 
      if (!this.user.email) this.errors.email = 'Email is required!';
      if (!phoneRegex.test(this.user.phoneNumber)) {
        this.errors.phoneNumber = 'Give Valid Phone Number!';
      }
      if (!this.user.phoneNumber) this.errors.phoneNumber = 'Phone number is required!';
      if (!this.user.password) this.errors.password = 'Password is required!';
      if (!this.user.userType && this.user.userType === 0) this.errors.userType = 'User Type is required!';
      if (Number(this.user.userType) === 2 && Number(this.user.roomownerid) === 0) {
        this.errors.roomownerid = 'Room Owner Name is Required For Members!';
      }

      if(Object.keys(this.errors).length > 0) return;

      //Finally Called API For Submit Data
      this.userService.userRegistration(this.user).subscribe({
        next : (res)=>{
          Swal.fire('Created', res.statusMessage, 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          Swal.fire('Error', err.statusMessage, 'error');
          console.error(err);
        }
      })

    }
}

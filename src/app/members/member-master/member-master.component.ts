import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../core/services/members.service';
import { MembersListForView } from '../../core/models/membersListForView.model';
import { CommonModule } from '@angular/common';
import { AppConstants } from '../../core/constants/common.model';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
@Component({
  selector: 'app-member-master',
  imports:[CommonModule],
  templateUrl: './member-master.component.html',
  styleUrls: ['./member-master.component.scss'],
  standalone: true,
})
export class MemberMasterComponent implements OnInit {
  membersList: MembersListForView[] = [];
  //roomOwnerId: number = UserService.userId$; 
  roomOwnerId: number = 0; 
  selectedImageUrl:string = '';

  constructor(
    private memberService: MembersService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.userId$.subscribe(userId=>{
      if(userId != null)
      {
        this.roomOwnerId = userId;
      }
    })
    this.getAllMembers();
  }

  getAllMembers(): void {
    this.memberService.getAllMembers(this.roomOwnerId).subscribe({
      next: (res) => {
        this.membersList = res.data;
      },
      error: (err) => {
        console.error('Error fetching members:', err);
      },
    });
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

    //Navigate to add members
    navigateToAddMembers()
    {
       this.router.navigate(['/admin/members/add']); //Directly Navigate To Add Members Form Component
    }
}

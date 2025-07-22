import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { MembersListForView } from '../../core/models/membersListForView.model';
import { MembersService } from '../../core/services/members.service';
import { CommonModule } from '@angular/common';
import { AppConstants } from '../../core/constants/common.model';

@Component({
  selector: 'app-view-members',
  imports: [CommonModule],
  templateUrl: './view-members.component.html',
  styleUrl: './view-members.component.scss'
})
export class ViewMembersComponent implements OnInit {
  member: MembersListForView | null = null;
  memberId:number = 0;
  selectedImageUrl:string = '';
  profileImageUrl:string|null = null;

  constructor(private router:Router,private route: ActivatedRoute, private memberService: MembersService){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params =>{
      const memberId = params.get("id");
      if(memberId)
      {
        //this.memberId = Number(memberId); //This is old format for type casting string to number
        this.memberId = +memberId; //This is new format for type casting string to number
      }
    })
    this.getSingleMember();
  }

  getSingleMember(): void {
    this.memberService.getAllMembers(this.memberId,'SINGLE').subscribe({
      next: (res) => {
        this.member = res.data[0]; //One Member Get All Time Here 
        this.profileImageUrl = this.getImageUrl(this.member?.profilePicture ?? '');
      },
      error: (err) => {
        console.error('Error fetching members:', err);
      },
    });
  }

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

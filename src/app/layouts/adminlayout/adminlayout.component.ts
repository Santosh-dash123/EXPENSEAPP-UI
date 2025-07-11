import { Component,OnInit  } from '@angular/core';
import { RouterModule, RouterOutlet,Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminlayout',
  imports: [RouterOutlet,RouterModule,CommonModule],
  templateUrl: './adminlayout.component.html',
  styleUrls: ['./adminlayout.component.scss']
})
export class AdminlayoutComponent implements OnInit {
  userName: string | null = '';
  isMasterMenuOpen: boolean = false;
   constructor(
    private router: Router,
    private userService : UserService
   ){}

   ngOnInit(): void {
     this.userService.userName$.subscribe(name => {
      this.userName = name;
     })
   }

   logout(){
    this.userService.clearUser();
    this.router.navigate(['/login']); //Navigate To Login Component with remove all local storage item ...
   }

   //Code for toggle master menu items
   toggleMasterMenu(): void {
    this.isMasterMenuOpen = !this.isMasterMenuOpen;
  }
}

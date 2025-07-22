export interface MembersListForView {
  id: number;
  roomOwnerId?: number;
  roomId?: number;
  roomName?: string;
  name?: string;
  gender?: string;
  adharCard?: string;    
  fatherName?: string;
  profilePicture?: string;        
  joiningDate?: Date;        
  address?: string;
  email?: string;
  phoneNumber?: string;
  workType?: number;
  workTypeName?:string;
  jobName?: string;
  companyName?: string;
  status?: number;
}
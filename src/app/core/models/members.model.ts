export interface Members {
  id?: number;
  roomOwnerId?: number;
  roomId?: number;
  name?: string;
  gender?: string;
  adharCard?: File | null;    
  fatherName?: string;
  image?: File | null;        
  joiningDate?: Date;        
  address?: string;
  email?: string;
  phoneNumber?: string;
  workType?: number;
  jobName?: string;
  companyName?: string;
  collegeName?: string;
  courseName?: string;
  status?: number;
}

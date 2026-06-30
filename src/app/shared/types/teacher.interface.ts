export interface TeacherInterface {
  // Basic Information
  id: number; //
  userId: number; //
  fullName: string; //
  phone: string; //
  email: string; //
  status: string; //
  createdDate: string; //
  monthlySalary?: string; //

  // Other Information
  nationalId?: number; //
  education?: string; //
  address: string; //
  gender?: string; //
  religion?: string; //
  bloodGroup?: string; //
  experience?: string;
  dob?: string;
}

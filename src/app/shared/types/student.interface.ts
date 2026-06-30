export interface StudentInterface {
  // student information
  id: number;
  fullName: string;
  registrationNumber: number;
  dateOfAdmission: number;
  classId: number;

  // other information
  email: string;
  dateOfBirth: string;
  gender: number;
  phone: number;
  address: string;
  bloodGroup: string;
  orphanStudent: string;
  religion: number;
  createdAt: string;
  updatedAt: string;

  // father/guardian information
  guardianName: string;
  guardian: string;
  guardianNationalId: number;
  guardianPhone: number;
  guardianEmail: string;
  guardianProfession: string;
  guardianIncome: string;

}

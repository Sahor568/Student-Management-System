export interface IStudent {
  // student information
  id: number;
  fullName: string;
  registrationNumber: number;
  dateOfAdmission: string;
  classId: number;
  className?: string;

  // other information
  email: string;
  dob: string;
  gender: number;
  phone: number;
  address: string;
  bloodGroup: string;
  orphanStudent: string;
  religion: string;
  createdAt: string;
  updatedAt: string;

  // father/guardian information
  guardian: string;
  guardianName: string;
  guardianNationalId: number;
  guardianPhone: number;
  guardianEmail: string;
  guardianAddress: string;
  guardianProfession: string;
  guardianIncome: number;
}

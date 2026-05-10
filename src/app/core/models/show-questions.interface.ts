import { Teacher } from './teacher.interface';
export interface ShowQuestions {
  id: string; 
  text: string;
  type: number;
  teacherFirstName: string;
  teacherLastName: string;
  isAssigned?: boolean;
  teacherOwnerId:string;
}

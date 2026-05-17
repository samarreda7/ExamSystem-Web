export interface ExamQuestion {
  questionId: string;
  text: string;
  type: number;
  options: Option[];
}
export interface Option {
  id: string;
  text: string;
  questionId: string;
}

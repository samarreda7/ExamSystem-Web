export interface SubmitExam {
  examId: string;
  answers: SubmitAnswer[];
}
export interface SubmitAnswer {
  questionId: string;
  optionId: string;
}

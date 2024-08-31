export interface ClassCade {
    id: number;
    name: string;
    teacher_ids: string;
    student_ids: string;
    subject: string;
    room: string;
    css_styles: string;
  }

export interface ClassCadeMaterial {
    id: number;
    date_created: string;
    title: string;
    description: string;
    links: string;
    classcade_id: number;
}
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request, context: { params: { id: number } }) {
  try {
    const formData = await request.formData();
    const { id } = context.params;

    const Title = formData.get('Title') as string;
    const Description = formData.get('Description') as string;
    const Links = formData.get('Links') as string;
    const due_date = formData.get('due_date') as string;
    const assessment_type = formData.get('assessment_type') as 'summative' | 'formative';
    const assignment_type = formData.get('assignment_type') as 'project' | 'lab' | 'essay' | 'test' | 'exam' | 'quiz' | 'presentation' | 'other';

    if (!Title || !Description || !due_date || !assessment_type || !assignment_type) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Insert into the Assessment table
    const [result] = await db.query(
      `INSERT INTO Assessment (title, description, links, due_date, assessment_type, assignment_type, classcade_id, date_created) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [Title, Description, Links || null, due_date, assessment_type, assignment_type, id]
    );

    return NextResponse.redirect(new URL(`/teaching/${id}`, request.url).toString());

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}

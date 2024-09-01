import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request, context: { params: { id: number } }) {
    try {
        
      const { id } = context.params;
      let { student } = await request.json();
      
      if (!student) {
        return NextResponse.json({ error: 'Student field is required' }, { status: 400 });
      }
      student = `, ${student}`;
  
      const [result] = await db.query(
        `UPDATE ClassCades
        SET student_ids = CONCAT(student_ids, ?)
        WHERE id = ?;`,
        [student, id]
      );
  
      return NextResponse.json({ success: 'student successfully added' }, { status: 500 });
      
  
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
  }
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request, context: { params: { id: number } }) {
    try {
        
      const { id } = context.params;
      let { teacher } = await request.json();
      
      if (!teacher) {
        return NextResponse.json({ error: 'teacher field is required' }, { status: 400 });
      }
      teacher = `, ${teacher}`;
  
      const [result] = await db.query(
        `UPDATE ClassCades
        SET teacher_ids = CONCAT(teacher_ids, ?)
        WHERE id = ?;`,
        [teacher, id]
      );
  
      return NextResponse.json({ success: 'teacher successfully added' }, { status: 500 });
      
  
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
  }
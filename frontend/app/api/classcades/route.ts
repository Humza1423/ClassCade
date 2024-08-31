import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(request: Request) {
  const { user, name, teachers, students, subject, room, color } = await request.json();

  teachers.push(user)
  const teachersStr = teachers.map((teacher: string) => teacher.replace(/'/g, "''")).join(', ');
  const studentsStr = students ? students.map((student: string) => student.replace(/'/g, "''")).join(', ') : null;

  try {
    const query = `
      INSERT INTO ClassCades (name, teacher_ids, ${students ? 'student_ids,': ''} subject, room, css_styles)
      VALUES (?, ?, ${students ? '?, ': ''} ?, ?, ?)
    `;
    const values = [
      name,
      teachersStr,
      ...(students ? [studentsStr] : []),
      subject,
      room,
      color
    ];

    // await db.query(
    //   `
    //   INSERT INTO ClassCades (name, teacher_ids, ${studentsStr ? 'student_ids,': ''} subject, room, css_styles)
    //   VALUES ('${name}', ${teachersStr}, ${studentsStr ? `'${studentsStr}',`: ''} '${subject}', '${room}', '${color}')
    // `,
    // );
    await db.query(query, values);
    return NextResponse.json({ message: 'ClassCade created successfully' }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create ClassCade' }, { status: 500 });
  }
}

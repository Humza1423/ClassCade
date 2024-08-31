import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    const { user } = await request.json();

    try {
        // Query for ClassCades where the user is a teacher
        const [classCadesAsTeacher] = await db.query(
            `SELECT * FROM ClassCades
            WHERE FIND_IN_SET(?, REPLACE(teacher_ids, ' ', '')) > 0`,
            [user]
        );
        console.log(classCadesAsTeacher);

        // Query for ClassCades where the user is a student
        const [classCadesAsStudent] = await db.query(
            `SELECT * FROM ClassCades
            WHERE FIND_IN_SET(?, REPLACE(student_ids, ' ', '')) > 0`,
            [user]
        );
        console.log(classCadesAsStudent);

        return NextResponse.json({ classCadesAsTeacher, classCadesAsStudent });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch ClassCades' }, { status: 500 });
    }
}

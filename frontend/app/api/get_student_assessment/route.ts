import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    const { condition, value } = await request.json();
    console.log(condition, value);

    try {
        // Query for ClassCades where the user is a teacher
        const query = `SELECT * FROM StudentAssessment WHERE ?? = ?`;
        const [StudentAssessment] = await db.query(query, [condition, value]);
        console.log(StudentAssessment);
        return NextResponse.json({ Assessment: StudentAssessment });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch ClassCades' }, { status: 500 });
    }
}

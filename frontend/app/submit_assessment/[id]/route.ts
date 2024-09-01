import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request, context: { params: { id: number } }) {
    try {
    const formData = await request.formData();
        const { id } = context.params;
        const submissions = formData.get('submissions') as string;
        const classId = formData.get('classId') as string;
        const user = formData.get('email') as string;

        if (!submissions|| !user) {
        return NextResponse.redirect(new URL(`/enrolled/assessment/${id}`, request.url).toString());
        }
        const [result] = await db.query(
        `INSERT INTO StudentAssessment (student_email, assessment_id, submission, submission_date) 
        VALUES (?, ?, ?, NOW())`,
        [user, id, submissions]
        );
        console.log(result);

        return NextResponse.redirect(new URL(`/enrolled/${classId}`, request.url).toString());
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request, context: { params: { id: number } }) {
    try {
    const formData = await request.formData();
        const { id } = context.params;
        let Mark = formData.get('Mark') as string;
        const assessmentId = formData.get('assessmentId') as string;

        if (!Mark) {
        return NextResponse.redirect(new URL(`/teaching/marking/${id}`, request.url).toString());
        }
        const [result] = await db.query(
        `UPDATE StudentAssessment
        SET mark = ?
        WHERE id = ?;`,
        [Mark, id]
        );
        console.log(result);

        return NextResponse.redirect(new URL(`/teaching/assessment/${assessmentId}`, request.url).toString());
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
}
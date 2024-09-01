import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    const { condition, values } = await request.json();
    console.log(condition, values);

    try {
        if (!Array.isArray(values) || values.length === 0) {
            return NextResponse.json({ error: 'Values must be a non-empty array' }, { status: 400 });
        }

        // Create a placeholder for each value in the list
        const placeholders = values.map(() => '?').join(', ');

        // Use a parameterized query to prevent SQL injection
        const query = `SELECT * FROM Assessment WHERE ${condition} IN (${placeholders})`;
        const [assessments] = await db.query(query, values);
        console.log('multipleargs:',assessments)

        console.log(assessments);
        return NextResponse.json({ assessments });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
    }
}

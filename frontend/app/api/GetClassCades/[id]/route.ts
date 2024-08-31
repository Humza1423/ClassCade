import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { useParams } from 'next/navigation';

export async function GET(request: Request, context: { params: { id: number } }) {
    const { id } = context.params;

    try {
        // Query for ClassCades where the user is a teacher
        const [classCade] = await db.query(
            `SELECT * FROM ClassCades
            WHERE id = ${id}`
        );

        console.log('class:', classCade);

        try {
            // Query for ClassCadeMaterials where the user is a teacher
            const [classCadeMaterial] = await db.query(`SELECT * FROM ClassCadeMaterial
        WHERE classcade_id = ${id};`);

            console.log(classCadeMaterial);

            return NextResponse.json({ classCade, classCadeMaterial });
        } catch (materialError) {
            if (materialError) {
                return NextResponse.json({ classCade: classCade, message: 'This ClassCade has no material (table does not exist)' });
            } else {
                console.error(materialError);
                return NextResponse.json({ error: 'Failed to fetch ClassCadeMaterials' }, { status: 500 });
            }
        }
        
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch ClassCades' }, { status: 500 });
    }
}

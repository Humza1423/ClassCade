import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request, context: { params: { id: number } }) {
  try {
  const formData = await request.formData();
    const { id } = context.params;
    const Title = formData.get('Title');
    const Description = formData.get('Description');
    const Links = formData.get('Links');
    
    if (!Title || !Description) {
      return NextResponse.json({ error: 'Title and Description are required' }, { status: 400 });
    }

    const [result] = await db.query(
      `INSERT INTO ClassCadeMaterial (classcade_id, title, description, links, date_created) 
      VALUES (?, ?, ?, ?, NOW())`,
      [id, Title, Description, Links || null]
    );

    return NextResponse.redirect(new URL(`/teaching/${id}`, request.url).toString());
    

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
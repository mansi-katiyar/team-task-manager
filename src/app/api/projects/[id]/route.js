import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { authenticate } from '@/lib/middleware';

export async function GET(request, { params }) {
  try {
    const auth = await authenticate(request);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });

  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

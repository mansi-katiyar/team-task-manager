import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
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
    const { projectId } = await params;

    const tasks = await Task.find({ projectId })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tasks });

  } catch (error) {
    console.error('Get tasks by project error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

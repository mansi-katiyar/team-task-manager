import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { authenticate } from '@/lib/middleware';

// PATCH update task status
export async function PATCH(request, { params }) {
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
    const body = await request.json();
    const { status } = body;

    if (!status || !['Todo', 'In Progress', 'Done'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required (Todo, In Progress, Done)' },
        { status: 400 }
      );
    }

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Members can only update their own tasks
    if (auth.user.role === 'member' && task.assignedTo?.toString() !== auth.user.userId) {
      return NextResponse.json(
        { success: false, error: 'You can only update tasks assigned to you' },
        { status: 403 }
      );
    }

    task.status = status;
    await task.save();

    const updated = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    return NextResponse.json({
      success: true,
      task: updated,
    });

  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { authenticate } from '@/lib/middleware';

export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    await dbConnect();

    const userId = new mongoose.Types.ObjectId(auth.user.userId);
    const now = new Date();
    let filter = {
      dueDate: { $lt: now },
      status: { $ne: 'Done' },
    };

    if (auth.user.role === 'admin') {
      const projects = await Project.find({ createdBy: userId }).select('_id');
      const projectIds = projects.map(p => p._id);
      filter.projectId = { $in: projectIds };
    } else {
      filter.assignedTo = userId;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .sort({ dueDate: 1 });

    return NextResponse.json({ success: true, tasks });

  } catch (error) {
    console.error('Get overdue tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

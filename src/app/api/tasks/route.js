import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { authenticate, requireAdmin } from '@/lib/middleware';

// GET all tasks for the user
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
    let tasks;
    if (auth.user.role === 'admin') {
      // Admin sees all tasks in their projects
      const projects = await Project.find({ createdBy: userId }).select('_id');
      const projectIds = projects.map(p => p._id);
      tasks = await Task.find({ projectId: { $in: projectIds } })
        .populate('assignedTo', 'name email')
        .populate('projectId', 'title')
        .sort({ createdAt: -1 });
    } else {
      // Members see their assigned tasks
      tasks = await Task.find({ assignedTo: userId })
        .populate('assignedTo', 'name email')
        .populate('projectId', 'title')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, tasks });

  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create task (admin only)
export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const adminCheck = requireAdmin(auth.user);
    if (adminCheck) {
      return NextResponse.json(
        { success: false, error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    await dbConnect();
    const body = await request.json();
    const { title, description, status, assignedTo, dueDate, projectId } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Task title is required' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Auto-add assigned user to project members if not already a member
    if (assignedTo) {
      const assignedObjectId = new mongoose.Types.ObjectId(assignedTo);
      const isMember = project.members.some(m => m.toString() === assignedTo);
      if (!isMember) {
        project.members.push(assignedObjectId);
        await project.save();
      }
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'Todo',
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      projectId,
    });

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    return NextResponse.json({
      success: true,
      task: populated,
    }, { status: 201 });

  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

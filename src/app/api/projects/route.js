import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { authenticate, requireAdmin } from '@/lib/middleware';

// GET all projects
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
    let projects;
    if (auth.user.role === 'admin') {
      projects = await Project.find({ createdBy: userId })
        .populate('members', 'name email role')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ members: userId })
        .populate('members', 'name email role')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, projects });

  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create project (admin only)
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
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Project title is required' },
        { status: 400 }
      );
    }

    const project = await Project.create({
      title,
      description: description || '',
      createdBy: auth.user.userId,
      members: [],
    });

    const populated = await Project.findById(project._id)
      .populate('createdBy', 'name email');

    return NextResponse.json({
      success: true,
      project: populated,
    }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

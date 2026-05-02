import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import { authenticate, requireAdmin } from '@/lib/middleware';

export async function POST(request, { params }) {
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
    const { id } = await params;
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Member email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const memberUser = await User.findOne({ email: email.toLowerCase() });
    if (!memberUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email not found' },
        { status: 404 }
      );
    }

    // Find project
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if already a member
    if (project.members.includes(memberUser._id)) {
      return NextResponse.json(
        { success: false, error: 'User is already a member of this project' },
        { status: 400 }
      );
    }

    // Add member
    project.members.push(memberUser._id);
    await project.save();

    const updated = await Project.findById(id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    return NextResponse.json({
      success: true,
      project: updated,
    });

  } catch (error) {
    console.error('Add member error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authenticate, requireAdmin } from '@/lib/middleware';

// GET all users (admin only — for task assignment)
export async function GET(request) {
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

    const users = await User.find({}).select('name email role').sort({ name: 1 });

    return NextResponse.json({ success: true, users });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

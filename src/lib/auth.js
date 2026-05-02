import bcryptjs from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me');

export async function hashPassword(password) {
  const salt = await bcryptjs.genSalt(12);
  return bcryptjs.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcryptjs.compare(password, hashedPassword);
}

export async function signToken(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return token;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

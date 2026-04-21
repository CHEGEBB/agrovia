/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY!;

export async function GET() {
  try {
    const url = `${APPWRITE_ENDPOINT}/users?limit=100`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        'X-Appwrite-Key': APPWRITE_API_KEY,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    // data.users is the Appwrite users list
    return NextResponse.json({ users: data.users ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
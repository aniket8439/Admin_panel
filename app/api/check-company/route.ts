// app/api/check-company/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock function to check if the company exists by email
async function checkCompanyByEmail(email: string): Promise<boolean> {
  // Implement your database logic here to check if the company exists
  // For demonstration purposes, we'll just return a hardcoded value
  const companyExists = true; // Replace this with actual database check
  return companyExists;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const companyExists = await checkCompanyByEmail(email);
    return NextResponse.json({ exists: companyExists });
  } catch (error) {
    console.error('Error checking company:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

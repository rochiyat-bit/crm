import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';
import { User, Company, Pipeline } from '@/lib/models';
import { authRateLimit, getClientId } from '@/lib/middleware/rateLimit';
import sequelize from '@/lib/db/config';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(request);
    const rateLimitResult = await authRateLimit(request, clientId);
    if (rateLimitResult) return rateLimitResult;

    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(validatedData.password, 12);

    // Create company and user in a transaction
    const result = await sequelize.transaction(async (transaction) => {
      // Create company
      const company = await Company.create(
        {
          name: validatedData.company_name,
          subscription_tier: 'free',
        },
        { transaction }
      );

      // Create default pipeline for the company
      await Pipeline.create(
        {
          company_id: company.id,
          name: 'Default Sales Pipeline',
          description: 'Default pipeline for sales deals',
          is_default: true,
          stages: [
            { name: 'Prospecting', order: 1, probability: 10 },
            { name: 'Qualification', order: 2, probability: 25 },
            { name: 'Proposal', order: 3, probability: 50 },
            { name: 'Negotiation', order: 4, probability: 75 },
            { name: 'Closed Won', order: 5, probability: 100 },
            { name: 'Closed Lost', order: 6, probability: 0 },
          ],
        },
        { transaction }
      );

      // Create user
      const user = await User.create(
        {
          name: validatedData.name,
          email: validatedData.email,
          password_hash,
          company_id: company.id,
          role: 'admin', // First user is admin
          is_active: true,
        },
        { transaction }
      );

      return { user, company };
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

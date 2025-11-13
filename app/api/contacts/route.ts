import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Contact, User } from '@/lib/models';
import { contactSchema } from '@/lib/validations/contact';
import { requireAuth } from '@/lib/middleware/auth';
import { apiRateLimit, getClientId } from '@/lib/middleware/rateLimit';
import { cache, cacheKeys, CACHE_TTL } from '@/lib/cache/redis';

// GET /api/contacts - List contacts with pagination and filters
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    // Rate limiting
    const clientId = getClientId(request);
    const rateLimitResult = await apiRateLimit(request, clientId);
    if (rateLimitResult) return rateLimitResult;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const owner_id = searchParams.get('owner_id') || '';
    const lead_source = searchParams.get('lead_source') || '';

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {
      company_id: user.company_id,
    };

    if (status) {
      where.status = status;
    }

    if (owner_id) {
      where.owner_id = owner_id;
    }

    if (lead_source) {
      where.lead_source = lead_source;
    }

    if (search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Try cache first
    const cacheKey = cacheKeys.contactList(
      user.company_id,
      page,
      JSON.stringify({ status, owner_id, search, lead_source })
    );
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Fetch from database
    const { rows: contacts, count: total } = await Contact.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'avatar_url'],
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    const response = {
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    await cache.set(cacheKey, response, CACHE_TTL.MEDIUM);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
    // Authentication
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    // Rate limiting
    const clientId = getClientId(request);
    const rateLimitResult = await apiRateLimit(request, clientId);
    if (rateLimitResult) return rateLimitResult;

    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Create contact
    const contact = await Contact.create({
      ...validatedData,
      company_id: user.company_id,
      owner_id: body.owner_id || user.id,
      created_by: user.id,
    });

    // Invalidate cache
    await cache.delPattern(`contacts:list:${user.company_id}:*`);

    return NextResponse.json(
      {
        success: true,
        message: 'Contact created successfully',
        data: contact,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create contact error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

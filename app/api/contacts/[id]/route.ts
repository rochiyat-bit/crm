import { NextRequest, NextResponse } from 'next/server';
import { Contact, Activity, Deal, Note } from '@/lib/models';
import { updateContactSchema } from '@/lib/validations/contact';
import { requireAuth } from '@/lib/middleware/auth';
import { cache } from '@/lib/cache/redis';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/contacts/:id - Get single contact with related data
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    const contact = await Contact.findOne({
      where: {
        id: params.id,
        company_id: user.company_id,
      },
      include: [
        {
          model: Activity,
          as: 'activities',
          limit: 10,
          order: [['created_at', 'DESC']],
        },
        {
          model: Deal,
          as: 'deals',
          limit: 10,
        },
        {
          model: Note,
          as: 'notes',
          limit: 5,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!contact) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Get contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PATCH /api/contacts/:id - Update contact
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    const body = await request.json();
    const validatedData = updateContactSchema.parse(body);

    const contact = await Contact.findOne({
      where: {
        id: params.id,
        company_id: user.company_id,
      },
    });

    if (!contact) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }

    await contact.update(validatedData);

    // Invalidate cache
    await cache.delPattern(`contacts:list:${user.company_id}:*`);

    return NextResponse.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error: any) {
    console.error('Update contact error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/:id - Delete contact
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    const contact = await Contact.findOne({
      where: {
        id: params.id,
        company_id: user.company_id,
      },
    });

    if (!contact) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }

    await contact.destroy();

    // Invalidate cache
    await cache.delPattern(`contacts:list:${user.company_id}:*`);

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}

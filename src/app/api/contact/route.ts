import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.enum([
    'general',
    'support',
    'feedback',
    'partnership',
    'press',
    'tool-submission',
    'report',
    'other',
  ]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Send email notification
    const adminEmail = process.env.ADMIN_EMAIL || 'hello@toolforge.ai';

    await sendEmail({
      to: adminEmail,
      subject: `[${validatedData.category}] ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(validatedData.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(validatedData.email)}</p>
        <p><strong>Category:</strong> ${escapeHtml(validatedData.category)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(validatedData.subject)}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(validatedData.message).replace(/\n/g, '<br>')}</p>
      `,
      text: `New Contact Form Submission\n\nName: ${validatedData.name}\nEmail: ${validatedData.email}\nCategory: ${validatedData.category}\nSubject: ${validatedData.subject}\n\nMessage:\n${validatedData.message}`,
    });

    // Store in database for tracking
    await supabaseAdmin
      .from('contact_submissions')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        category: validatedData.category,
        message: validatedData.message,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      })
      .then(({ error }) => {
        // Log but don't fail the request if DB insert fails (table may not exist yet)
        if (error) {
          console.warn('Could not store contact submission in DB:', error.message);
        }
      });

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request',
      },
      { status: 500 }
    );
  }
}

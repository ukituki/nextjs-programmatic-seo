import { NextRequest, NextResponse } from 'next/server';
import { nicheConfig } from '@/config'; // To access active niche details

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Determine active niche name for logging
    // Using nicheNamePlural as it's generally more descriptive for a collection of leads
    const activeNicheDisplayName = nicheConfig.nicheNamePlural || nicheConfig.leadGenForm?.nicheName || 'Unknown Niche';

    // Log the data to the server console
    console.log('--- New Lead Submission ---');
    console.log('Active Niche:', activeNicheDisplayName);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Submitted Data:', body);
    console.log('--- End of Lead Submission ---');

    // Future enhancements could include:
    // - Validating the 'body' against the 'nicheConfig.leadGenForm?.steps' definitions.
    // - Storing the lead data in a database or sending it to a CRM.
    // - Triggering notifications.

    return NextResponse.json({ 
      message: "Lead submitted successfully", 
      niche: activeNicheDisplayName, // Include niche in response for clarity
      dataReceived: body 
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing lead submission:', error);

    let errorMessage = 'Error processing request';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (error instanceof SyntaxError) { // Specific error for JSON parsing issues
      return NextResponse.json({ message: 'Invalid JSON in request body', error: errorMessage }, { status: 400 });
    }
    
    // Generic server error
    return NextResponse.json({ message: 'Error processing request', error: errorMessage }, { status: 500 });
  }
}

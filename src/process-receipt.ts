import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

async function processReceipt(imagePath: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: ANTHROPIC_API_KEY not found');
    process.exit(1);
  }

  console.log('📸 Reading receipt image...');
  
  // Read the image file
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  console.log('🤖 Sending to Claude for processing...\n');
  
  const client = new Anthropic({ apiKey });
  
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Extract all data from this grocery receipt and return as JSON.

Include:
- merchant (store name)
- date (YYYY-MM-DD format)
- total (number)
- items (array of objects with: name, quantity, price, category)

Categories: Produce, Meat, Dairy, Bakery, Frozen, Pantry, Snacks, Beverages, Health & Beauty, Household, Other

Return ONLY valid JSON, no other text.`
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }]
    });

const responseText = response.content[0]?.text || '';
    
    // Try to parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      
      console.log('✅ Receipt processed successfully!\n');
      console.log('📊 Results:');
      console.log(JSON.stringify(data, null, 2));
      
      return data;
    } else {
      console.error('❌ Could not find JSON in response');
      console.log('Response:', responseText);
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Get image path from command line argument
const imagePath = process.argv[2] || './sample-receipts/sample-receipt-safeway6.10.25.jpeg';

console.log(`🔍 Processing: ${imagePath}\n`);
processReceipt(imagePath);
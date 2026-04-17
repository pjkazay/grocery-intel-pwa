import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

async function testClaudeAPI() {
  // Get API key from environment
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: ANTHROPIC_API_KEY not found in .env file');
    process.exit(1);
  }

  // Create Claude client
  const client = new Anthropic({
    apiKey: apiKey
  });

  console.log('🧪 Testing Claude API connection...\n');

  try {
    // Send a simple test message
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Say hello in exactly 5 words.'
      }]
    });

    // Check if we got a response
    if (response.content && response.content.length > 0) {
      console.log('✅ Success! Claude is connected.\n');
      console.log('Claude says:', response.content[0].text);
      console.log('\n🎉 API test complete! You\'re ready to process receipts.');
    }
  } catch (error: any) {
    console.error('❌ Error connecting to Claude:');
    console.error(error.message);
    
    if (error.message.includes('api_key')) {
      console.log('\n💡 Tip: Check that your API key in .env is correct');
    }
  }
}

// Run the test
testClaudeAPI();
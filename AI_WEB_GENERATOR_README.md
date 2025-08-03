# AI Web Generator - API Integration Guide

## Overview

The AI Web Generator is an intelligent website creation platform that uses AI APIs to automatically generate website templates based on user descriptions. This guide explains how to integrate with various AI services and deploy on Vercel.

## Features

- **AI-Powered Template Generation**: Automatically creates HTML/CSS templates from text descriptions
- **Multiple Style Options**: Modern, Classic, Minimal, and Creative design styles
- **Color Scheme Customization**: 6 predefined color schemes (Blue, Green, Purple, Orange, Dark, Light)
- **Multi-Page Support**: Generate additional pages (Blog, Portfolio, Shop, Team, Custom)
- **Component Library**: Reusable components (Contact Forms, Newsletters, Testimonials)
- **Visual Editor**: GrapesJS-powered drag-and-drop editor
- **Responsive Design**: Mobile-first responsive templates

## API Integration Options

### 1. OpenAI GPT-4 Integration

**Setup:**
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to environment variables:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

**Implementation:**
```javascript
const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Generate a ${style} website for ${projectName}: ${description}`
    }]
  })
});
```

### 2. Anthropic Claude Integration

**Setup:**
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to environment variables:
   ```bash
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

**Implementation:**
```javascript
const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `Generate a ${style} website for ${projectName}: ${description}`
    }]
  })
});
```

### 3. Vercel AI SDK Integration

**Setup:**
1. Install Vercel AI SDK:
   ```bash
   npm install ai @ai-sdk/openai @ai-sdk/anthropic
   ```
2. Add to environment variables:
   ```bash
   VERCEL_AI_API_KEY=your_vercel_ai_key_here
   ```

**Implementation:**
```javascript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4'),
  prompt: `Generate a ${style} website for ${projectName}: ${description}`
});
```

## Vercel Deployment

### Environment Variables Setup

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:

```bash
# Required for AI functionality
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
VERCEL_AI_API_KEY=your_vercel_ai_key_here

# Application URLs
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app

# Other required variables (copy from .env.example)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# ... other variables as needed
```

### Deployment Steps

1. **Connect Repository:**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Add AI Web Generator"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically

3. **Verify Deployment:**
   - Test the web generator at `/web-gen/projects`
   - Verify AI generation functionality

## API Endpoints

### POST `/api/web-gen/ai-generate`

Generates AI-powered website templates.

**Request Body:**
```json
{
  "projectName": "My Business",
  "description": "A modern business website with services and contact info",
  "style": "modern",
  "colorScheme": "blue",
  "pages": ["blog", "portfolio"],
  "features": ["contact-form", "newsletter"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mainHtml": "<html>...</html>",
    "mainCss": "body { ... }",
    "pages": [
      {
        "name": "blog",
        "html": "<html>...</html>",
        "css": "body { ... }"
      }
    ],
    "components": {
      "navbar": "<nav>...</nav>",
      "footer": "<footer>...</footer>"
    }
  }
}
```

## Usage Flow

1. **User Input:**
   - Project name and description
   - Style preference (Modern, Classic, Minimal, Creative)
   - Color scheme selection
   - Additional pages and features

2. **AI Processing:**
   - Send request to AI API
   - Generate HTML/CSS based on input
   - Create additional pages and components

3. **Template Creation:**
   - Combine AI-generated content
   - Apply styling and responsive design
   - Create project in database

4. **Visual Editing:**
   - Open in GrapesJS editor
   - Drag-and-drop customization
   - Real-time preview

5. **Publishing:**
   - Generate static files
   - Deploy to hosting platform
   - Provide live URL

## Cost Considerations

### API Pricing (Approximate)

- **OpenAI GPT-4:** $0.03 per 1K input tokens, $0.06 per 1K output tokens
- **Anthropic Claude:** $0.015 per 1K input tokens, $0.075 per 1K output tokens
- **Vercel AI:** Varies by provider, often includes free tier

### Optimization Tips

1. **Cache Templates:** Store generated templates to avoid repeated API calls
2. **Batch Requests:** Generate multiple pages in single API call
3. **Fallback System:** Use internal templates when API is unavailable
4. **Rate Limiting:** Implement request limits to control costs

## Security Best Practices

1. **API Key Protection:**
   - Never expose API keys in client-side code
   - Use environment variables
   - Rotate keys regularly

2. **Input Validation:**
   - Sanitize user inputs
   - Limit description length
   - Validate style and color options

3. **Rate Limiting:**
   - Implement per-user limits
   - Add cooldown periods
   - Monitor usage patterns

## Troubleshooting

### Common Issues

1. **API Key Errors:**
   - Verify environment variables are set
   - Check API key validity
   - Ensure sufficient API credits

2. **Generation Failures:**
   - Check API response format
   - Implement fallback templates
   - Add error logging

3. **Deployment Issues:**
   - Verify all environment variables in Vercel
   - Check build logs for errors
   - Test API endpoints individually

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API key configuration
3. Test with fallback templates
4. Review Vercel deployment logs

---

**Note:** The current implementation includes a robust fallback system that works without external AI APIs. External AI integration enhances the quality and variety of generated templates but is not required for basic functionality.
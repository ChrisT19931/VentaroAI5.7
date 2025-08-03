// AI Service for Web Generator
// This service handles integration with various AI providers

export interface AIProvider {
  name: string;
  generateWebsite: (prompt: string) => Promise<string>;
}

export interface WebsiteGenerationRequest {
  projectName: string;
  description: string;
  style: 'modern' | 'classic' | 'minimal' | 'creative';
  colorScheme: string;
  pages?: string[];
  features?: string[];
}

export interface WebsiteGenerationResponse {
  html: string;
  css: string;
  success: boolean;
  provider?: string;
}

// OpenAI Provider
export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateWebsite(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional web developer. Generate clean, modern HTML and CSS code for websites. Return only the HTML and CSS code without explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI generation error:', error);
      throw error;
    }
  }
}

// Anthropic Provider
export class AnthropicProvider implements AIProvider {
  name = 'Anthropic';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateWebsite(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: `You are a professional web developer. Generate clean, modern HTML and CSS code for the following website: ${prompt}. Return only the HTML and CSS code without explanations.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0]?.text || '';
    } catch (error) {
      console.error('Anthropic generation error:', error);
      throw error;
    }
  }
}

// AI Service Manager
export class AIService {
  private providers: AIProvider[] = [];
  private fallbackEnabled = true;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize providers based on available API keys
    if (process.env.OPENAI_API_KEY) {
      this.providers.push(new OpenAIProvider(process.env.OPENAI_API_KEY));
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.push(new AnthropicProvider(process.env.ANTHROPIC_API_KEY));
    }
  }

  private createPrompt(request: WebsiteGenerationRequest): string {
    const { projectName, description, style, colorScheme, pages = [], features = [] } = request;
    
    let prompt = `Create a ${style} style website for "${projectName}". Description: ${description}. `;
    prompt += `Use a ${colorScheme} color scheme. `;
    
    if (pages.length > 0) {
      prompt += `Include these additional pages: ${pages.join(', ')}. `;
    }
    
    if (features.length > 0) {
      prompt += `Include these features: ${features.join(', ')}. `;
    }
    
    prompt += 'Generate complete HTML and CSS code that is responsive and modern. ';
    prompt += 'Structure the response as: HTML code first, then CSS code separated by a comment.';
    
    return prompt;
  }

  private parseLLMResponse(response: string): { html: string; css: string } {
    // Try to extract HTML and CSS from the LLM response
    const htmlMatch = response.match(/<!DOCTYPE html[\s\S]*?<\/html>/i) || 
                     response.match(/<html[\s\S]*?<\/html>/i);
    
    const cssMatch = response.match(/\/\*[\s\S]*?\*\/[\s\S]*?(?=<|$)/) ||
                    response.match(/body\s*{[\s\S]*?}[\s\S]*/) ||
                    response.match(/\*\s*{[\s\S]*/);

    let html = htmlMatch ? htmlMatch[0] : '';
    let css = cssMatch ? cssMatch[0].replace(/\/\*[\s\S]*?\*\//g, '').trim() : '';

    // If we can't parse properly, try to split by common patterns
    if (!html || !css) {
      const parts = response.split(/(?:CSS|css|style)/i);
      if (parts.length >= 2) {
        html = parts[0].trim();
        css = parts[1].trim();
      }
    }

    return { html, css };
  }

  private generateFallbackTemplate(request: WebsiteGenerationRequest): { html: string; css: string } {
    // Fallback to internal template generation
    const { projectName, description, colorScheme } = request;
    
    const colors = {
      blue: { primary: '#2563EB', secondary: '#3B82F6', accent: '#60A5FA' },
      green: { primary: '#059669', secondary: '#10B981', accent: '#34D399' },
      purple: { primary: '#7C3AED', secondary: '#8B5CF6', accent: '#A78BFA' },
      orange: { primary: '#EA580C', secondary: '#FB923C', accent: '#FDBA74' },
      dark: { primary: '#1F2937', secondary: '#374151', accent: '#6B7280' },
      light: { primary: '#F3F4F6', secondary: '#E5E7EB', accent: '#D1D5DB' }
    };
    
    const scheme = colors[colorScheme as keyof typeof colors] || colors.blue;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">${projectName}</div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>Welcome to ${projectName}</h1>
                <p>${description}</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>
        
        <section id="about" class="about">
            <div class="container">
                <h2>About Us</h2>
                <p>Learn more about our mission and values.</p>
            </div>
        </section>
        
        <section id="services" class="services">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    <div class="service-card">
                        <h3>Service 1</h3>
                        <p>Description of service 1</p>
                    </div>
                    <div class="service-card">
                        <h3>Service 2</h3>
                        <p>Description of service 2</p>
                    </div>
                    <div class="service-card">
                        <h3>Service 3</h3>
                        <p>Description of service 3</p>
                    </div>
                </div>
            </div>
        </section>
        
        <section id="contact" class="contact">
            <div class="container">
                <h2>Contact Us</h2>
                <p>Get in touch with our team</p>
                <button class="contact-button">Contact Now</button>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    background: ${scheme.primary};
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-menu a:hover {
    color: ${scheme.accent};
}

.hero {
    background: linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary});
    color: white;
    padding: 120px 0 80px;
    text-align: center;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-button, .contact-button {
    background: ${scheme.accent};
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s;
}

.cta-button:hover, .contact-button:hover {
    background: ${scheme.secondary};
}

.about, .services, .contact {
    padding: 80px 0;
}

.about {
    background: #f8f9fa;
}

.about h2, .services h2, .contact h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: ${scheme.primary};
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.service-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-card h3 {
    color: ${scheme.primary};
    margin-bottom: 1rem;
}

.contact {
    background: ${scheme.primary};
    color: white;
    text-align: center;
}

.contact h2 {
    color: white;
}

.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

@media (max-width: 768px) {
    .nav-menu {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
}`;

    return { html, css };
  }

  async generateWebsite(request: WebsiteGenerationRequest): Promise<WebsiteGenerationResponse> {
    // Try AI providers first
    for (const provider of this.providers) {
      try {
        console.log(`Attempting generation with ${provider.name}...`);
        const prompt = this.createPrompt(request);
        const response = await provider.generateWebsite(prompt);
        
        if (response) {
          const { html, css } = this.parseLLMResponse(response);
          
          if (html && css) {
            return {
              html,
              css,
              success: true,
              provider: provider.name
            };
          }
        }
      } catch (error) {
        console.error(`${provider.name} generation failed:`, error);
        continue; // Try next provider
      }
    }

    // Fallback to internal template generation
    if (this.fallbackEnabled) {
      console.log('Using fallback template generation...');
      const { html, css } = this.generateFallbackTemplate(request);
      return {
        html,
        css,
        success: true,
        provider: 'Internal'
      };
    }

    throw new Error('All AI providers failed and fallback is disabled');
  }

  // Utility methods
  getAvailableProviders(): string[] {
    return this.providers.map(p => p.name);
  }

  setFallbackEnabled(enabled: boolean) {
    this.fallbackEnabled = enabled;
  }
}

// Export singleton instance
export const aiService = new AIService();
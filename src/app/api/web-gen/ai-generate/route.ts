import { NextRequest, NextResponse } from 'next/server';
import { aiService, WebsiteGenerationRequest } from '@/lib/ai-service';

interface AIGenerateRequest {
  name?: string;
  projectName?: string;
  description: string;
  style: 'modern' | 'classic' | 'minimal' | 'creative';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'dark' | 'light';
  pages?: string[]; // Additional pages to generate
  features?: string[]; // Specific features to include
  aiConfig?: {
    provider: 'openai' | 'anthropic';
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
}

interface PageContent {
  name: string;
  html: string;
  route: string;
}

interface AITemplateResponse {
  mainHtml: string;
  mainCss: string;
  html?: string; // For backward compatibility
  css?: string;  // For backward compatibility
  pages: PageContent[];
  components: { [key: string]: string };
  metadata?: {
    generatedAt: string;
    provider: string;
    style: string;
    colorScheme: string;
    features: string[];
  };
}

// Helper function to get color scheme
const getColorScheme = (colorScheme: string) => {
  const schemes = {
    blue: { primary: '#2563EB', secondary: '#3B82F6', accent: '#60A5FA', light: '#EFF6FF' },
    green: { primary: '#059669', secondary: '#10B981', accent: '#34D399', light: '#ECFDF5' },
    purple: { primary: '#7C3AED', secondary: '#8B5CF6', accent: '#A78BFA', light: '#F3E8FF' },
    orange: { primary: '#EA580C', secondary: '#FB923C', accent: '#FDBA74', light: '#FFF7ED' },
    dark: { primary: '#1F2937', secondary: '#374151', accent: '#6B7280', light: '#F9FAFB' },
    light: { primary: '#F3F4F6', secondary: '#E5E7EB', accent: '#D1D5DB', light: '#FFFFFF' }
  };
  return schemes[colorScheme as keyof typeof schemes] || schemes.blue;
}

interface AIGenerateResponse {
  success: boolean;
  html?: string;
  css?: string;
  error?: string;
}



// Generate additional pages based on user requirements
const generateAdditionalPages = (pages: string[], context: { projectName: string; description: string; style: string; colorScheme: string }): PageContent[] => {
  const { projectName, description, colorScheme } = context;
  const generatedPages: PageContent[] = [];
  
  pages.forEach(pageName => {
    switch (pageName.toLowerCase()) {
      case 'blog':
        generatedPages.push(generateBlogPage(projectName, colorScheme));
        break;
      case 'portfolio':
        generatedPages.push(generatePortfolioPage(projectName, colorScheme));
        break;
      case 'shop':
      case 'store':
        generatedPages.push(generateShopPage(projectName, colorScheme));
        break;
      case 'team':
        generatedPages.push(generateTeamPage(projectName, colorScheme));
        break;
      default:
        generatedPages.push(generateCustomPage(pageName, projectName, colorScheme));
    }
  });
  
  return generatedPages;
};

// Generate reusable components based on features
const generateComponents = (features: string[], context: { projectName: string; description: string; style: string; colorScheme: string }): { [key: string]: string } => {
  const { colorScheme } = context;
  const colors = getColorScheme(colorScheme);
  const components: { [key: string]: string } = {};
  
  // Always include basic components
  components.navbar = `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">Brand</div>
        <ul class="nav-menu">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>`;
    
  components.footer = `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Brand. All rights reserved.</p>
      </div>
    </footer>`;
    
  components.hero = `
    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to Our Website</h1>
        <p>Your journey starts here</p>
        <button class="cta-button">Get Started</button>
      </div>
    </section>`;
  
  // Add feature-specific components
  features.forEach(feature => {
    switch (feature.toLowerCase()) {
      case 'contact-form':
        components.contactForm = `
          <div class="contact-form-component">
            <form class="contact-form">
              <input type="text" placeholder="Your Name" required>
              <input type="email" placeholder="Your Email" required>
              <textarea placeholder="Your Message" required></textarea>
              <button type="submit" style="background-color: ${colors.primary};">Send Message</button>
            </form>
          </div>`;
        break;
      case 'newsletter':
        components.newsletter = `
          <div class="newsletter-component">
            <h3>Subscribe to Our Newsletter</h3>
            <form class="newsletter-form">
              <input type="email" placeholder="Enter your email">
              <button type="submit" style="background-color: ${colors.primary};">Subscribe</button>
            </form>
          </div>`;
        break;
      case 'testimonials':
        components.testimonials = `
          <div class="testimonials-component">
            <h3>What Our Clients Say</h3>
            <div class="testimonial">
              <p>"Amazing service and great results!"</p>
              <cite>- Happy Customer</cite>
            </div>
          </div>`;
        break;
    }
  });
  
  return components;
};



// Template generators for different styles
const generateModernTemplate = (projectName: string, description: string, colorScheme: string) => {
  const scheme = getColorScheme(colorScheme);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Header Section -->
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <h1>${projectName}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <h1 class="hero-title">Welcome to ${projectName}</h1>
            <p class="hero-description">${description || 'Your amazing website description goes here'}</p>
            <button class="cta-button">Get Started</button>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2>About Us</h2>
            <p>We are passionate about delivering exceptional experiences and innovative solutions.</p>
            <div class="features">
                <div class="feature">
                    <h3>Quality</h3>
                    <p>We deliver high-quality solutions that exceed expectations.</p>
                </div>
                <div class="feature">
                    <h3>Innovation</h3>
                    <p>We stay ahead of the curve with cutting-edge technology.</p>
                </div>
                <div class="feature">
                    <h3>Support</h3>
                    <p>Our dedicated team provides 24/7 customer support.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
        <div class="container">
            <h2>Our Services</h2>
            <div class="services-grid">
                <div class="service-card">
                    <h3>Web Development</h3>
                    <p>Custom websites built with modern technologies.</p>
                </div>
                <div class="service-card">
                    <h3>Mobile Apps</h3>
                    <p>Native and cross-platform mobile applications.</p>
                </div>
                <div class="service-card">
                    <h3>Digital Marketing</h3>
                    <p>Comprehensive digital marketing strategies.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2>Contact Us</h2>
            <form class="contact-form">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <textarea placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

  const css = `
* {
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

/* Header Styles */
.header {
    background: ${scheme.primary};
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.nav-brand h1 {
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

/* Hero Section */
.hero {
    background: linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary});
    color: white;
    padding: 120px 0 80px;
    text-align: center;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: bold;
}

.hero-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: ${scheme.accent};
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* About Section */
.about {
    padding: 80px 0;
    background: #f8f9fa;
}

.about h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${scheme.secondary};
}

.about p {
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.feature {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.feature:hover {
    transform: translateY(-5px);
}

.feature h3 {
    color: ${scheme.primary};
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

/* Services Section */
.services {
    padding: 80px 0;
}

.services h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${scheme.secondary};
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.service-card {
    background: ${scheme.primary};
    color: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-card h3 {
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

/* Contact Section */
.contact {
    padding: 80px 0;
    background: #f8f9fa;
}

.contact h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${scheme.secondary};
}

.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.contact-form textarea {
    min-height: 120px;
    resize: vertical;
}

.contact-form button {
    background: ${scheme.primary};
    color: white;
    padding: 15px;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s;
}

.contact-form button:hover {
    background: ${scheme.secondary};
}

/* Footer */
.footer {
    background: ${scheme.secondary};
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-menu {
        gap: 1rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-description {
        font-size: 1rem;
    }
    
    .features,
    .services-grid {
        grid-template-columns: 1fr;
    }
}`;

  return { html, css };
};

// Page generators for different page types
const generateBlogPage = (projectName: string, colorScheme: string): PageContent => {
  const scheme = getColorScheme(colorScheme);
  
  return {
    name: 'Blog',
    route: '/blog',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - ${projectName}</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand"><h1>${projectName}</h1></div>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="../contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="blog-main">
        <div class="container">
            <h1 class="page-title">Our Blog</h1>
            <div class="blog-grid">
                <article class="blog-post">
                    <img src="https://via.placeholder.com/400x250" alt="Blog post">
                    <div class="post-content">
                        <h2>Getting Started with Web Development</h2>
                        <p class="post-meta">Published on March 15, 2024</p>
                        <p>Learn the fundamentals of modern web development...</p>
                        <a href="#" class="read-more">Read More</a>
                    </div>
                </article>
                <article class="blog-post">
                    <img src="https://via.placeholder.com/400x250" alt="Blog post">
                    <div class="post-content">
                        <h2>Design Trends for 2024</h2>
                        <p class="post-meta">Published on March 10, 2024</p>
                        <p>Explore the latest design trends shaping the web...</p>
                        <a href="#" class="read-more">Read More</a>
                    </div>
                </article>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
  };
};

const generatePortfolioPage = (projectName: string, colorScheme: string): PageContent => {
  const scheme = getColorScheme(colorScheme);
  
  return {
    name: 'Portfolio',
    route: '/portfolio',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${projectName}</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand"><h1>${projectName}</h1></div>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="portfolio.html">Portfolio</a></li>
                <li><a href="../contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="portfolio-main">
        <div class="container">
            <h1 class="page-title">Our Portfolio</h1>
            <div class="portfolio-grid">
                <div class="portfolio-item">
                    <img src="https://via.placeholder.com/400x300" alt="Project 1">
                    <div class="portfolio-overlay">
                        <h3>Project One</h3>
                        <p>Web Development</p>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="https://via.placeholder.com/400x300" alt="Project 2">
                    <div class="portfolio-overlay">
                        <h3>Project Two</h3>
                        <p>Mobile App</p>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="https://via.placeholder.com/400x300" alt="Project 3">
                    <div class="portfolio-overlay">
                        <h3>Project Three</h3>
                        <p>UI/UX Design</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
  };
};

const generateShopPage = (projectName: string, colorScheme: string): PageContent => {
  return {
    name: 'Shop',
    route: '/shop',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop - ${projectName}</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand"><h1>${projectName}</h1></div>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="shop.html">Shop</a></li>
                <li><a href="../contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="shop-main">
        <div class="container">
            <h1 class="page-title">Our Products</h1>
            <div class="products-grid">
                <div class="product-card">
                    <img src="https://via.placeholder.com/300x300" alt="Product 1">
                    <h3>Product One</h3>
                    <p class="price">$99.99</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
                <div class="product-card">
                    <img src="https://via.placeholder.com/300x300" alt="Product 2">
                    <h3>Product Two</h3>
                    <p class="price">$149.99</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
  };
};

const generateTeamPage = (projectName: string, colorScheme: string): PageContent => {
  return {
    name: 'Team',
    route: '/team',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team - ${projectName}</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand"><h1>${projectName}</h1></div>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="team.html">Team</a></li>
                <li><a href="../contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="team-main">
        <div class="container">
            <h1 class="page-title">Meet Our Team</h1>
            <div class="team-grid">
                <div class="team-member">
                    <img src="https://via.placeholder.com/250x250" alt="Team Member">
                    <h3>John Doe</h3>
                    <p class="role">CEO & Founder</p>
                    <p>Leading the company with vision and passion.</p>
                </div>
                <div class="team-member">
                    <img src="https://via.placeholder.com/250x250" alt="Team Member">
                    <h3>Jane Smith</h3>
                    <p class="role">Lead Developer</p>
                    <p>Building amazing digital experiences.</p>
                </div>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
  };
};

const generateCustomPage = (pageName: string, projectName: string, colorScheme: string): PageContent => {
  return {
    name: pageName,
    route: `/${pageName.toLowerCase()}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageName} - ${projectName}</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand"><h1>${projectName}</h1></div>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="${pageName.toLowerCase()}.html">${pageName}</a></li>
                <li><a href="../contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="page-main">
        <div class="container">
            <h1 class="page-title">${pageName}</h1>
            <p>Welcome to the ${pageName} page. This content can be customized based on your needs.</p>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
  };
};

const generateClassicTemplate = (projectName: string, description: string, colorScheme: string) => {
  // Similar structure but with classic styling
  const scheme = getColorScheme(colorScheme);
  
  // Return classic template with serif fonts and traditional layout
  return generateModernTemplate(projectName, description, colorScheme);
};

export async function POST(request: NextRequest) {
  try {
    const body: AIGenerateRequest = await request.json();
    const { 
      description, 
      name, 
      projectName, 
      style = 'modern', 
      colorScheme = 'blue', 
      pages = [], 
      features = [],
      aiConfig
    } = body;

    const finalProjectName = name || projectName;
    
    if (!description || !finalProjectName) {
      return NextResponse.json(
        { success: false, error: 'Description and project name are required' },
        { status: 400 }
      );
    }

    let aiResult;
    let provider = 'internal';

    // Use external AI if configuration is provided
    if (aiConfig && aiConfig.provider !== 'internal') {
      try {
        // Create a temporary AI service instance with the provided config
        const tempAiService = new (await import('@/lib/ai-service')).AIService();
        
        // Configure the provider
        if (aiConfig.provider === 'openai') {
          const { OpenAIProvider } = await import('@/lib/ai-service');
          const openaiProvider = new OpenAIProvider(aiConfig.apiKey, aiConfig.model);
          tempAiService.addProvider('openai', openaiProvider);
          tempAiService.setDefaultProvider('openai');
        } else if (aiConfig.provider === 'anthropic') {
          const { AnthropicProvider } = await import('@/lib/ai-service');
          const anthropicProvider = new AnthropicProvider(aiConfig.apiKey, aiConfig.model);
          tempAiService.addProvider('anthropic', anthropicProvider);
          tempAiService.setDefaultProvider('anthropic');
        }

        const aiRequest: WebsiteGenerationRequest = {
          projectName: finalProjectName,
          description,
          style,
          colorScheme,
          pages,
          features
        };

        aiResult = await tempAiService.generateWebsite(aiRequest);
        provider = aiConfig.provider;
      } catch (aiError) {
        console.error('External AI generation failed, falling back to internal:', aiError);
        // Fall back to internal generation
        const aiRequest: WebsiteGenerationRequest = {
          projectName: finalProjectName,
          description,
          style,
          colorScheme,
          pages,
          features
        };
        aiResult = await aiService.generateWebsite(aiRequest);
      }
    } else {
      // Use internal AI service
      const aiRequest: WebsiteGenerationRequest = {
        projectName: finalProjectName,
        description,
        style,
        colorScheme,
        pages,
        features
      };
      aiResult = await aiService.generateWebsite(aiRequest);
    }
    
    if (!aiResult.success) {
      throw new Error('AI generation failed');
    }

    // Generate additional pages and components using existing functions
    const context = { projectName: finalProjectName, description, style, colorScheme };
    const additionalPages = generateAdditionalPages(pages, context);
    const components = generateComponents(features, context);

    const result: AITemplateResponse = {
      mainHtml: aiResult.html || '',
      mainCss: aiResult.css || '',
      html: aiResult.html || '', // For backward compatibility
      css: aiResult.css || '',  // For backward compatibility
      pages: additionalPages,
      components,
      metadata: {
        generatedAt: new Date().toISOString(),
        provider: aiResult.provider || provider,
        style,
        colorScheme,
        features
      }
    };

    return NextResponse.json({
      success: true,
      html: result.mainHtml,
      css: result.mainCss,
      mainHtml: result.mainHtml,
      mainCss: result.mainCss,
      pages: result.pages,
      components: result.components,
      metadata: result.metadata,
      provider: aiResult.provider || provider
    });

  } catch (error) {
    console.error('AI Generate Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
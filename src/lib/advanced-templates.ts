export interface TemplateComponent {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children?: TemplateComponent[];
  styles?: Record<string, string>;
  order?: number;
  visible?: boolean;
  content?: string;
}

export interface TemplateTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface AdvancedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  components: TemplateComponent[];
  theme: TemplateTheme;
  pages: {
    id: string;
    name: string;
    route: string;
    components: TemplateComponent[];
  }[];
}

// Modern Business Theme
const modernBusinessTheme: TemplateTheme = {
  name: 'Modern Business',
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b'
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  }
};

// Creative Portfolio Theme
const creativePortfolioTheme: TemplateTheme = {
  name: 'Creative Portfolio',
  colors: {
    primary: '#7c3aed',
    secondary: '#a78bfa',
    accent: '#f472b6',
    background: '#0f0f23',
    surface: '#1e1e3f',
    text: '#f8fafc',
    textSecondary: '#cbd5e1'
  },
  fonts: {
    heading: 'Playfair Display, serif',
    body: 'Source Sans Pro, sans-serif'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  }
};

// E-commerce Theme
const ecommerceTheme: TemplateTheme = {
  name: 'E-commerce',
  colors: {
    primary: '#059669',
    secondary: '#6b7280',
    accent: '#dc2626',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280'
  },
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  }
};

// Advanced Templates
export const advancedTemplates: AdvancedTemplate[] = [
  {
    id: 'modern-business',
    name: 'Modern Business',
    description: 'Professional business website with clean design and modern aesthetics',
    category: 'Business',
    thumbnail: '/templates/modern-business.jpg',
    theme: modernBusinessTheme,
    components: [
      {
        id: 'header',
        type: 'Header',
        name: 'Navigation Header',
        props: {
          logo: 'Your Company',
          navigation: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Contact', href: '/contact' }
          ],
          ctaButton: { label: 'Get Started', href: '/contact' }
        },
        styles: {
          backgroundColor: modernBusinessTheme.colors.background,
          color: modernBusinessTheme.colors.text,
          padding: modernBusinessTheme.spacing.md
        }
      },
      {
        id: 'hero',
        type: 'Hero',
        name: 'Hero Section',
        props: {
          title: 'Transform Your Business with Innovation',
          subtitle: 'We help companies scale and grow through cutting-edge technology solutions and strategic consulting.',
          ctaButton: { label: 'Learn More', href: '/about' },
          secondaryButton: { label: 'Contact Us', href: '/contact' },
          backgroundImage: '/images/hero-bg.jpg'
        },
        styles: {
          backgroundColor: modernBusinessTheme.colors.surface,
          color: modernBusinessTheme.colors.text,
          padding: `${modernBusinessTheme.spacing.xl} 0`
        }
      },
      {
        id: 'features',
        type: 'Features',
        name: 'Features Grid',
        props: {
          title: 'Why Choose Us',
          features: [
            {
              icon: 'rocket',
              title: 'Fast Delivery',
              description: 'Quick turnaround times without compromising quality'
            },
            {
              icon: 'shield',
              title: 'Secure & Reliable',
              description: 'Enterprise-grade security and 99.9% uptime guarantee'
            },
            {
              icon: 'users',
              title: 'Expert Team',
              description: 'Experienced professionals dedicated to your success'
            }
          ]
        },
        styles: {
          backgroundColor: modernBusinessTheme.colors.background,
          padding: `${modernBusinessTheme.spacing.xl} 0`
        }
      },
      {
        id: 'footer',
        type: 'Footer',
        name: 'Site Footer',
        props: {
          companyName: 'Your Company',
          links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Support', href: '/support' }
          ],
          socialLinks: [
            { platform: 'twitter', url: '#' },
            { platform: 'linkedin', url: '#' },
            { platform: 'facebook', url: '#' }
          ]
        },
        styles: {
          backgroundColor: modernBusinessTheme.colors.surface,
          color: modernBusinessTheme.colors.textSecondary,
          padding: modernBusinessTheme.spacing.lg
        }
      }
    ],
    pages: [
      {
        id: 'home',
        name: 'Home',
        route: '/',
        components: [
          {
            id: 'header-1',
            type: 'Header',
            name: 'Navigation Header',
            props: {
              logo: 'Your Company',
              navigation: [
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Contact', href: '/contact' }
              ],
              ctaButton: { label: 'Get Started', href: '/contact' }
            }
          },
          {
            id: 'hero-1',
            type: 'Hero',
            name: 'Hero Section',
            props: {
              title: 'Transform Your Business with Innovation',
              subtitle: 'We help companies scale and grow through cutting-edge technology solutions and strategic consulting.',
              ctaButton: { label: 'Learn More', href: '/about' },
              secondaryButton: { label: 'Contact Us', href: '/contact' },
              backgroundImage: '/images/hero-bg.jpg'
            }
          },
          {
            id: 'features-1',
            type: 'Features',
            name: 'Features Grid',
            props: {
              title: 'Why Choose Us',
              features: [
                {
                  icon: 'rocket',
                  title: 'Fast Delivery',
                  description: 'Quick turnaround times without compromising quality'
                },
                {
                  icon: 'shield',
                  title: 'Secure & Reliable',
                  description: 'Enterprise-grade security and 99.9% uptime guarantee'
                },
                {
                  icon: 'users',
                  title: 'Expert Team',
                  description: 'Experienced professionals dedicated to your success'
                }
              ]
            }
          },
          {
            id: 'footer-1',
            type: 'Footer',
            name: 'Site Footer',
            props: {
              companyName: 'Your Company',
              links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Support', href: '/support' }
              ],
              socialLinks: [
                { platform: 'twitter', url: '#' },
                { platform: 'linkedin', url: '#' },
                { platform: 'facebook', url: '#' }
              ]
            }
          }
        ]
      },
      {
        id: 'about',
        name: 'About',
        route: '/about',
        components: [
          {
            id: 'about-hero',
            type: 'PageHero',
            name: 'About Hero',
            props: {
              title: 'About Our Company',
              subtitle: 'Learn more about our mission, vision, and the team behind our success.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Stunning portfolio website for creatives, artists, and designers',
    category: 'Portfolio',
    thumbnail: '/templates/creative-portfolio.jpg',
    theme: creativePortfolioTheme,
    components: [
      {
        id: 'header',
        type: 'Header',
        name: 'Creative Header',
        props: {
          logo: 'Creative Studio',
          navigation: [
            { label: 'Work', href: '/work' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ],
          style: 'minimal'
        },
        styles: {
          backgroundColor: 'transparent',
          color: creativePortfolioTheme.colors.text,
          position: 'fixed',
          top: '0',
          width: '100%',
          zIndex: '1000'
        }
      },
      {
        id: 'hero',
        type: 'CreativeHero',
        name: 'Creative Hero',
        props: {
          title: 'Creative Designer & Visual Artist',
          subtitle: 'Crafting beautiful experiences through design',
          portfolioItems: [
            { image: '/portfolio/item1.jpg', title: 'Project One' },
            { image: '/portfolio/item2.jpg', title: 'Project Two' },
            { image: '/portfolio/item3.jpg', title: 'Project Three' }
          ]
        },
        styles: {
          backgroundColor: creativePortfolioTheme.colors.background,
          color: creativePortfolioTheme.colors.text,
          minHeight: '100vh'
        }
      }
    ],
    pages: [
      {
        id: 'home',
        name: 'Home',
        route: '/',
        components: [
          {
            id: 'header-2',
            type: 'Header',
            name: 'Creative Header',
            props: {
              logo: 'Creative Studio',
              navigation: [
                { label: 'Work', href: '/work' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' }
              ],
              style: 'minimal'
            }
          },
          {
            id: 'hero-2',
            type: 'CreativeHero',
            name: 'Creative Hero',
            props: {
              title: 'Creative Designer & Visual Artist',
              subtitle: 'Crafting beautiful experiences through design',
              portfolioItems: [
                { image: '/portfolio/item1.jpg', title: 'Project One' },
                { image: '/portfolio/item2.jpg', title: 'Project Two' },
                { image: '/portfolio/item3.jpg', title: 'Project Three' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'Complete online store with product catalog and shopping features',
    category: 'E-commerce',
    thumbnail: '/templates/ecommerce-store.jpg',
    theme: ecommerceTheme,
    components: [
      {
        id: 'header',
        type: 'EcommerceHeader',
        name: 'Store Header',
        props: {
          logo: 'Your Store',
          searchBar: true,
          cartIcon: true,
          userAccount: true,
          navigation: [
            { label: 'Shop', href: '/shop' },
            { label: 'Categories', href: '/categories' },
            { label: 'Deals', href: '/deals' },
            { label: 'About', href: '/about' }
          ]
        },
        styles: {
          backgroundColor: ecommerceTheme.colors.background,
          borderBottom: `1px solid ${ecommerceTheme.colors.secondary}20`
        }
      },
      {
        id: 'hero-banner',
        type: 'PromoBanner',
        name: 'Promotional Banner',
        props: {
          title: 'Summer Sale - Up to 50% Off',
          subtitle: 'Limited time offer on selected items',
          ctaButton: { label: 'Shop Now', href: '/shop' },
          backgroundImage: '/images/sale-banner.jpg'
        }
      },
      {
        id: 'featured-products',
        type: 'ProductGrid',
        name: 'Featured Products',
        props: {
          title: 'Featured Products',
          products: [
            {
              id: '1',
              name: 'Premium Headphones',
              price: '$199.99',
              image: '/products/headphones.jpg',
              rating: 4.5
            },
            {
              id: '2',
              name: 'Wireless Speaker',
              price: '$89.99',
              image: '/products/speaker.jpg',
              rating: 4.8
            }
          ]
        }
      }
    ],
    pages: [
      {
        id: 'home',
        name: 'Home',
        route: '/',
        components: [
          {
            id: 'header-3',
            type: 'EcommerceHeader',
            name: 'Store Header',
            props: {
              logo: 'Your Store',
              searchBar: true,
              cartIcon: true,
              userAccount: true,
              navigation: [
                { label: 'Shop', href: '/shop' },
                { label: 'Categories', href: '/categories' },
                { label: 'Deals', href: '/deals' },
                { label: 'About', href: '/about' }
              ]
            }
          },
          {
            id: 'hero-banner-1',
            type: 'PromoBanner',
            name: 'Promotional Banner',
            props: {
              title: 'Summer Sale - Up to 50% Off',
              subtitle: 'Limited time offer on selected items',
              ctaButton: { label: 'Shop Now', href: '/shop' },
              backgroundImage: '/images/sale-banner.jpg'
            }
          },
          {
            id: 'featured-products-1',
            type: 'ProductGrid',
            name: 'Featured Products',
            props: {
              title: 'Featured Products',
              products: [
                {
                  id: '1',
                  name: 'Premium Headphones',
                  price: '$199.99',
                  image: '/products/headphones.jpg',
                  rating: 4.5
                },
                {
                  id: '2',
                  name: 'Wireless Speaker',
                  price: '$89.99',
                  image: '/products/speaker.jpg',
                  rating: 4.8
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

// Template generation functions
export function generateTemplateHTML(template: AdvancedTemplate): string {
  const { theme, components } = template;
  
  const componentHTML = components.map(component => {
    switch (component.type) {
      case 'Header':
        return generateHeaderHTML(component, theme);
      case 'Hero':
        return generateHeroHTML(component, theme);
      case 'Features':
        return generateFeaturesHTML(component, theme);
      case 'Footer':
        return generateFooterHTML(component, theme);
      default:
        return `<div class="component-${component.type.toLowerCase()}">${component.name}</div>`;
    }
  }).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${generateTemplateCSS(template)}
  </style>
</head>
<body>
  ${componentHTML}
</body>
</html>
  `;
}

export function generateTemplateCSS(template: AdvancedTemplate): string {
  const { theme } = template;
  
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-secondary: ${theme.colors.textSecondary};
      --font-heading: ${theme.fonts.heading};
      --font-body: ${theme.fonts.body};
      --spacing-xs: ${theme.spacing.xs};
      --spacing-sm: ${theme.spacing.sm};
      --spacing-md: ${theme.spacing.md};
      --spacing-lg: ${theme.spacing.lg};
      --spacing-xl: ${theme.spacing.xl};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: var(--font-body);
      background-color: var(--color-background);
      color: var(--color-text);
      line-height: 1.6;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      font-weight: 600;
      line-height: 1.2;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-md);
    }
    
    .btn {
      display: inline-block;
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-primary);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
    }
    
    .btn:hover {
      background-color: var(--color-primary)dd;
      transform: translateY(-1px);
    }
    
    .btn-secondary {
      background-color: transparent;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
    }
    
    .btn-secondary:hover {
      background-color: var(--color-primary);
      color: white;
    }
  `;
}

// Component HTML generators
function generateHeaderHTML(component: TemplateComponent, theme: TemplateTheme): string {
  const { props } = component;
  const navItems = props.navigation.map((item: any) => 
    `<a href="${item.href}" class="nav-link">${item.label}</a>`
  ).join('');
  
  return `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">${props.logo}</div>
          <nav class="navigation">
            ${navItems}
          </nav>
          ${props.ctaButton ? `<a href="${props.ctaButton.href}" class="btn">${props.ctaButton.label}</a>` : ''}
        </div>
      </div>
    </header>
    <style>
      .header {
        background-color: ${component.styles?.backgroundColor || theme.colors.background};
        padding: ${component.styles?.padding || theme.spacing.md};
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-primary);
      }
      .navigation {
        display: flex;
        gap: var(--spacing-lg);
      }
      .nav-link {
        text-decoration: none;
        color: var(--color-text);
        font-weight: 500;
        transition: color 0.2s ease;
      }
      .nav-link:hover {
        color: var(--color-primary);
      }
    </style>
  `;
}

function generateHeroHTML(component: TemplateComponent, theme: TemplateTheme): string {
  const { props } = component;
  
  return `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">${props.title}</h1>
          <p class="hero-subtitle">${props.subtitle}</p>
          <div class="hero-buttons">
            ${props.ctaButton ? `<a href="${props.ctaButton.href}" class="btn">${props.ctaButton.label}</a>` : ''}
            ${props.secondaryButton ? `<a href="${props.secondaryButton.href}" class="btn btn-secondary">${props.secondaryButton.label}</a>` : ''}
          </div>
        </div>
      </div>
    </section>
    <style>
      .hero {
        background-color: ${component.styles?.backgroundColor || theme.colors.surface};
        padding: ${component.styles?.padding || `${theme.spacing.xl} 0`};
        text-align: center;
        ${props.backgroundImage ? `background-image: url(${props.backgroundImage}); background-size: cover; background-position: center;` : ''}
      }
      .hero-content {
        max-width: 800px;
        margin: 0 auto;
      }
      .hero-title {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
        color: var(--color-text);
      }
      .hero-subtitle {
        font-size: 1.25rem;
        margin-bottom: var(--spacing-lg);
        color: var(--color-text-secondary);
      }
      .hero-buttons {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
        flex-wrap: wrap;
      }
    </style>
  `;
}

function generateFeaturesHTML(component: TemplateComponent, theme: TemplateTheme): string {
  const { props } = component;
  const featuresHTML = props.features.map((feature: any) => `
    <div class="feature-item">
      <div class="feature-icon">${feature.icon}</div>
      <h3 class="feature-title">${feature.title}</h3>
      <p class="feature-description">${feature.description}</p>
    </div>
  `).join('');
  
  return `
    <section class="features">
      <div class="container">
        <h2 class="features-title">${props.title}</h2>
        <div class="features-grid">
          ${featuresHTML}
        </div>
      </div>
    </section>
    <style>
      .features {
        background-color: ${component.styles?.backgroundColor || theme.colors.background};
        padding: ${component.styles?.padding || `${theme.spacing.xl} 0`};
      }
      .features-title {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: var(--spacing-xl);
        color: var(--color-text);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-lg);
      }
      .feature-item {
        text-align: center;
        padding: var(--spacing-lg);
        background-color: var(--color-surface);
        border-radius: 12px;
        transition: transform 0.2s ease;
      }
      .feature-item:hover {
        transform: translateY(-4px);
      }
      .feature-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
        color: var(--color-primary);
      }
      .feature-title {
        font-size: 1.5rem;
        margin-bottom: var(--spacing-sm);
        color: var(--color-text);
      }
      .feature-description {
        color: var(--color-text-secondary);
      }
    </style>
  `;
}

function generateFooterHTML(component: TemplateComponent, theme: TemplateTheme): string {
  const { props } = component;
  const linksHTML = props.links.map((link: any) => 
    `<a href="${link.href}" class="footer-link">${link.label}</a>`
  ).join('');
  
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>${props.companyName}</h3>
          </div>
          <div class="footer-links">
            ${linksHTML}
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ${props.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
    <style>
      .footer {
        background-color: ${component.styles?.backgroundColor || theme.colors.surface};
        color: ${component.styles?.color || theme.colors.textSecondary};
        padding: ${component.styles?.padding || theme.spacing.lg};
        margin-top: auto;
      }
      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
      }
      .footer-brand h3 {
        color: var(--color-primary);
      }
      .footer-links {
        display: flex;
        gap: var(--spacing-md);
      }
      .footer-link {
        text-decoration: none;
        color: var(--color-text-secondary);
        transition: color 0.2s ease;
      }
      .footer-link:hover {
        color: var(--color-primary);
      }
      .footer-bottom {
        text-align: center;
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--color-text-secondary)33;
      }
    </style>
  `;
}
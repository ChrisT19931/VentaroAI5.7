# Advanced Web Builder System

A comprehensive, modern web development platform with visual editing, template system, and AI integration.

## 🚀 Features

### Visual Editor
- **Drag & Drop Interface**: Intuitive component placement and reordering
- **Real-time Preview**: See changes instantly as you build
- **Component Library**: Pre-built components for rapid development
- **Responsive Design**: Built-in mobile, tablet, and desktop views
- **Visual Controls**: Easy component manipulation with hover controls

### Template System
- **Advanced Templates**: Professional, modern website templates
- **Theme Support**: Multiple color schemes and styling options
- **Component-based**: Modular template structure for flexibility
- **Instant Generation**: One-click template application

### AI Integration
- **Multiple Providers**: Support for OpenAI, Anthropic, and internal AI
- **Smart Generation**: Context-aware website creation
- **Feature Selection**: Choose specific features to include
- **Style Customization**: AI-powered design variations

### Code Editor
- **Syntax Highlighting**: Professional code editing experience
- **Live Preview**: Split-screen code and preview
- **Export Options**: Download complete HTML/CSS packages
- **Version Control**: Undo/redo functionality

## 🏗️ Architecture

### Core Components

#### 1. AdvancedWebBuilder (`src/components/web-gen/AdvancedWebBuilder.tsx`)
Main orchestrator component that manages:
- Project state and page management
- Component library and templates
- Export and sharing functionality
- History tracking (undo/redo)

#### 2. VisualEditor (`src/components/web-gen/VisualEditor.tsx`)
Handles the visual editing experience:
- Drag and drop functionality
- Component selection and manipulation
- Real-time preview updates
- Responsive viewport switching

#### 3. TemplateSelector (`src/components/web-gen/TemplateSelector.tsx`)
Manages template selection and application:
- Template browsing and filtering
- Preview generation
- Template application to projects

#### 4. Advanced Templates (`src/lib/advanced-templates.ts`)
Defines the template system:
- Template structure and components
- Theme definitions
- HTML/CSS generation utilities

### Data Flow

```
User Input → AdvancedWebBuilder → VisualEditor → Component Updates → Real-time Preview
     ↓
Template Selection → Template Application → Project State Update
     ↓
AI Generation → External API → Generated Content → Project Integration
```

## 🎨 Template System

### Available Templates

1. **Modern Business**
   - Clean, professional design
   - Hero section with call-to-action
   - Features showcase
   - Contact forms

2. **Creative Portfolio**
   - Visual-focused layout
   - Project galleries
   - About sections
   - Creative typography

3. **E-commerce**
   - Product showcases
   - Shopping cart integration
   - Customer testimonials
   - Newsletter signup

### Template Structure

```typescript
interface AdvancedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: TemplateTheme;
  pages: {
    name: string;
    components: TemplateComponent[];
  }[];
  features: string[];
}
```

## 🤖 AI Integration

### Supported Providers

1. **OpenAI**
   - GPT-4 and GPT-3.5-turbo support
   - Advanced prompt engineering
   - Context-aware generation

2. **Anthropic**
   - Claude model support
   - Structured output generation
   - Safety-focused responses

3. **Internal AI**
   - Fallback generation system
   - Template-based responses
   - Consistent output format

### AI Configuration

```typescript
interface AIConfig {
  provider: 'openai' | 'anthropic' | 'internal';
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

## 🛠️ Development Guide

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install lucide-react
   ```

2. **Import Components**
   ```typescript
   import { AdvancedWebBuilder } from '@/components/web-gen/AdvancedWebBuilder';
   ```

3. **Basic Usage**
   ```tsx
   <AdvancedWebBuilder
     projectId="your-project-id"
     initialProject={projectData}
     onSave={handleSave}
   />
   ```

### Creating Custom Templates

1. **Define Template Structure**
   ```typescript
   const customTemplate: AdvancedTemplate = {
     id: 'custom-template',
     name: 'Custom Template',
     description: 'Your custom template description',
     category: 'custom',
     theme: {
       colors: { /* color scheme */ },
       fonts: { /* font definitions */ }
     },
     pages: [/* page definitions */],
     features: [/* feature list */]
   };
   ```

2. **Add to Template Library**
   ```typescript
   // In src/lib/advanced-templates.ts
   export const advancedTemplates = [
     ...existingTemplates,
     customTemplate
   ];
   ```

### Adding Custom Components

1. **Define Component Type**
   ```typescript
   interface CustomComponent extends TemplateComponent {
     type: 'custom-type';
     content: {
       // Custom content structure
     };
   }
   ```

2. **Implement Rendering**
   ```typescript
   const renderCustomComponent = (component: CustomComponent) => {
     return `<div class="custom-component">${component.content}</div>`;
   };
   ```

## 📱 Responsive Design

### Viewport Modes
- **Desktop**: Full-width layout (1200px+)
- **Tablet**: Medium layout (768px - 1199px)
- **Mobile**: Compact layout (< 768px)

### CSS Framework
The system uses Tailwind CSS for styling with custom CSS for advanced effects:
- Glass morphism effects
- Smooth animations
- Modern gradients
- Dark mode support

## 🔧 API Endpoints

### Project Management
- `GET /api/web-gen/projects/[id]` - Fetch project
- `PUT /api/web-gen/projects/[id]` - Update project
- `DELETE /api/web-gen/projects/[id]` - Delete project

### AI Generation
- `POST /api/web-gen/ai-generate` - Generate website with AI

### Preview
- `GET /web-gen/preview/[id]` - Preview generated website

## 🎯 Usage Examples

### Basic Project Creation
```typescript
const handleCreateProject = async () => {
  const project = {
    name: 'My Website',
    description: 'A modern business website',
    template: 'modern-business',
    aiConfig: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7
    }
  };
  
  const result = await createProject(project);
};
```

### Template Application
```typescript
const applyTemplate = (templateId: string) => {
  const template = advancedTemplates.find(t => t.id === templateId);
  if (template) {
    const generatedProject = generateTemplateHTML(template);
    updateProject(generatedProject);
  }
};
```

### AI Generation
```typescript
const generateWithAI = async (prompt: string, config: AIConfig) => {
  const response = await fetch('/api/web-gen/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      aiConfig: config,
      features: ['contact-form', 'newsletter', 'blog']
    })
  });
  
  const result = await response.json();
  return result;
};
```

## 🚀 Performance Optimizations

### Code Splitting
- Lazy loading of heavy components
- Dynamic imports for templates
- Optimized bundle sizes

### Caching
- Template caching for faster loading
- Component memoization
- Efficient re-rendering

### Memory Management
- Cleanup of event listeners
- Proper component unmounting
- Optimized state updates

## 🔒 Security Features

### API Key Management
- Secure storage of API keys
- Environment variable usage
- No client-side exposure

### Input Validation
- Sanitized user inputs
- XSS prevention
- CSRF protection

### Content Security
- Safe HTML generation
- Validated template content
- Secure iframe usage

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📈 Future Enhancements

### Planned Features
- [ ] Advanced animation system
- [ ] Custom CSS editor
- [ ] Component marketplace
- [ ] Collaboration features
- [ ] Version control integration
- [ ] Advanced SEO tools
- [ ] Performance analytics
- [ ] A/B testing capabilities

### Technical Improvements
- [ ] WebAssembly integration
- [ ] Service worker caching
- [ ] Progressive Web App features
- [ ] Advanced accessibility tools
- [ ] Real-time collaboration
- [ ] Cloud storage integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community Discord

---

**Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS**
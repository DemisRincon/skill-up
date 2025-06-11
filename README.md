# Skill Up Leader - Leadership Feedback Platform

A modern web application for collecting and analyzing leadership feedback surveys, built with Next.js 15 and Supabase.

## Tech Stack & Dependencies

### Core Framework
- **Next.js 15.3.3**
  - React 19.0.0
  - TypeScript 5
  - App Router architecture
  - Server-side rendering
  - API routes
  - Built-in optimizations

### UI & Styling
- **Tailwind CSS 4**
  - Utility-first CSS framework
  - Custom design system
  - Responsive design
  - Dark mode support

### Icons & UI Components
- **Heroicons 2.2.0**
  - Beautiful hand-crafted SVG icons
  - Consistent icon system
- **Lucide React 0.514.0**
  - Additional icon set
  - Customizable icons

### Database & Authentication
- **Supabase 2.24.3**
  - PostgreSQL database
  - Authentication system
  - Real-time capabilities
  - Row Level Security
- **@supabase/auth-helpers-nextjs 0.10.0**
  - Next.js integration
  - Auth helpers
  - Session management

### Email Integration
- **@emailjs/browser 4.4.1**
  - Email template system
  - Survey notifications
  - User communications

### Utilities
- **clsx 2.1.1**
  - Class name utilities
  - Conditional classes
- **tailwind-merge 3.3.1**
  - Tailwind class merging
  - Style conflict resolution
- **uuid 11.1.0**
  - Unique ID generation
  - Survey and response tracking

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn
- Supabase account

### Environment Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/skill-up.git
cd skill-up
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_key
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
```

### Development
```bash
# Run development server
npm run dev
# or
yarn dev

# Lint code
npm run lint
# or
yarn lint
```

### Production Build
```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm run start
# or
yarn start
```

## Project Structure
```
skill-up/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── components/            # Shared UI components
├── public/               # Static assets
└── styles/              # Global styles
```

## Features
- User authentication with Supabase
- Survey creation and management
- Real-time survey responses
- Email notifications with EmailJS
- Data visualization
- Responsive design
- Dark mode support

## Development Tools
- **ESLint 9**
  - Code quality
  - Style enforcement
  - Next.js specific rules
- **TypeScript 5**
  - Type safety
  - Better developer experience
  - Enhanced code quality

## Deployment

### Vercel (Recommended)
1. Push your code to a Git repository
2. Import your project to Vercel
3. Configure environment variables
4. Deploy!

### Netlify
1. Push your code to a Git repository
2. Connect to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy!

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

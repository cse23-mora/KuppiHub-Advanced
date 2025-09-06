# KuppiHub - Student Learning Management System

A modern, structured frontend for managing academic modules and student-created supplementary videos (kuppi) built with Next.js and Tailwind CSS.

## 🎯 What is Kuppi?

"Kuppi" refers to supplementary learning materials created by students to help their peers understand complex topics. These can include:
- Video explanations
- Study notes
- Practice problems
- Concept summaries
- Telegram download links
- Additional learning resources

## 🏗️ System Architecture

The system follows a simplified hierarchical structure:
1. **Faculty** → **Department** → **Semester** → **Modules** → **Kuppi Videos**
2. Users can view all available modules for their semester
3. Each module contains student-created kuppi videos with embedded YouTube players

## 🚀 Features

### Core Functionality
- **Simplified Selection**: Faculty → Department → Semester → Modules
- **Module Discovery**: View all available modules for the semester
- **Kuppi Browsing**: Browse and view student-created learning materials
- **YouTube Integration**: Embedded video players for seamless viewing
- **Resource Sharing**: Access Telegram links and material files

### User Experience
- **Progressive Flow**: Step-by-step selection process
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Intuitive Navigation**: Clear back buttons and breadcrumbs
- **Visual Feedback**: Loading states, error handling, and success messages

### Content Management
- **Video URLs**: Multiple video sources (YouTube, etc.)
- **Telegram Links**: Direct download links
- **Material Files**: Notes, PDFs, and additional resources
- **Metadata**: Titles, descriptions, and timestamps
- **Read-only Access**: Browse and view existing kuppi content

## 📁 Project Structure

```
src/app/
├── page.tsx                 # Home page (redirects to faculty)
├── faculty/page.tsx         # Faculty selection
├── department/page.tsx      # Department selection
├── semester/page.tsx       # Semester selection + Module display
├── module-kuppi/page.tsx   # View kuppi videos for a specific module
├── dashboard/page.tsx      # Main dashboard with modules

├── videos/page.tsx         # View all videos for a module
├── browse-kuppi/page.tsx   # Browse all kuppi videos
└── my-kuppi/page.tsx      # Manage user's own kuppi
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **State Management**: React hooks with localStorage
- **Database**: Supabase PostgreSQL (ready for integration)

## 🗄️ Database Schema

The system is designed to work with the following PostgreSQL tables:

```sql
-- Core tables
faculties (id, name)
departments (id, name, faculty_id)
batches (id, name)
semesters (id, name)
students (id, name, faculty_id, department_id, batch_id, semester_id, image_url)

-- Module management
modules (id, code, name, description)
module_assignments (id, module_id, faculty_id, department_id, batch_id, semester_id)
student_additional_modules (id, student_id, module_id)

-- Video content
videos (id, module_id, title, youtube_links, telegram_links, material_urls, is_kuppi, student_id, created_at)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kuppihub-advanced
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Supabase Integration

To connect with your Supabase database:

1. **Install Supabase client**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create environment variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Replace mock data calls** in each page component with actual Supabase queries

### Example Supabase Query

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fetch faculties
const { data: faculties, error } = await supabase
  .from('faculties')
  .select('*')
  .order('name')
```

## 🎨 Customization

### Colors and Themes
The system uses Tailwind CSS with a consistent color scheme:
- **Blue**: Primary actions and navigation
- **Green**: Success states and confirmations
- **Purple**: Kuppi-related elements
- **Orange**: Creation and editing actions
- **Red**: Destructive actions

### Component Styling
Each page uses gradient backgrounds and consistent card layouts:
- Rounded corners (`rounded-lg`)
- Subtle shadows (`shadow-lg`)
- Hover effects (`hover:shadow-xl`)
- Smooth transitions (`transition-all`)

## 📱 Responsive Design

The system is fully responsive with:
- **Mobile-first approach**
- **Grid layouts** that adapt to screen size
- **Touch-friendly buttons** and interactions
- **Optimized spacing** for different devices

## 🔒 Security Considerations

- **No authentication required** (as per requirements)
- **Input validation** on forms
- **URL sanitization** for external links
- **XSS prevention** through proper React practices

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
The system can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- **User Authentication**: Login and user profiles
- **Real-time Updates**: Live notifications and chat
- **Advanced Search**: Full-text search and filters
- **Analytics Dashboard**: Usage statistics and insights
- **Mobile App**: React Native companion app
- **API Integration**: RESTful API for external access

---

**Built with ❤️ for the student community**

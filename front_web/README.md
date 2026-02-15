<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Buildex4Syria - 3D Room Configurator Platform

A comprehensive platform for designing and configuring 3D rooms with materials, furniture, and cost estimation.

## Project Structure

```
Buildex4Syria/
│
├── 📱 front_web/                    # Main Web Application (React + TypeScript)
│   ├── public/
│   │   ├── textures/                # Texture assets
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── components/             # React Components
│   │   │   ├── auth/               # Authentication components
│   │   │   │   ├── PrivateRoute.tsx
│   │   │   │   ├── RoleGate.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── layout/             # Layout components
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   │
│   │   │   ├── room-configurator/  # 3D Room Configurator components
│   │   │   │   ├── AccordionSidebar.tsx
│   │   │   │   ├── admin-panel.tsx
│   │   │   │   ├── constants.ts
│   │   │   │   ├── room-configurator.tsx
│   │   │   │   ├── Room3D.tsx
│   │   │   │   ├── SceneConfig.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── ui/                 # UI components (shadcn/ui)
│   │   │   │   └── [45 UI components]
│   │   │   │
│   │   │   └── home.tsx
│   │   │
│   │   ├── pages/                  # Page Components
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   │
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── ProviderRegisterPage.tsx
│   │   │   │
│   │   │   ├── dashboard/         # Dashboard pages
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── ProviderDashboard.tsx
│   │   │   │   └── UserDashboard.tsx
│   │   │   │
│   │   │   └── room-configurator/  # Room configurator pages
│   │   │       ├── AdminRoomConfiguratorPage.tsx
│   │   │       ├── ProviderRoomConfiguratorPage.tsx
│   │   │       └── RoomConfiguratorPage.tsx
│   │   │
│   │   ├── contexts/               # React Contexts
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── hooks/                  # Custom React Hooks
│   │   │   └── useRoleAccess.ts
│   │   │
│   │   ├── lib/                    # Utility libraries
│   │   │   ├── api.ts             # API client
│   │   │   └── utils.ts           # Utility functions
│   │   │
│   │   ├── types/                  # TypeScript type definitions
│   │   │   └── supabase.ts
│   │   │
│   │   ├── stories/               # Storybook stories
│   │   │   └── [39 story files]
│   │   │
│   │   ├── App.tsx                # Main App component
│   │   ├── main.tsx              # Entry point
│   │   ├── index.css             # Global styles
│   │   └── vite-env.d.ts         # Vite type definitions
│   │
│   ├── package.json
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── tsconfig.json             # TypeScript configuration
│   └── README.md
│
├── 🔧 backend/                      # Backend API (Node.js + Express)
│   ├── config.js                  # Configuration file
│   ├── server.js                  # Express server entry point
│   ├── createAdmin.js             # Admin user creation script
│   ├── seedData.js                # Database seeding script
│   │
│   ├── db/                        # Database configuration
│   │   └── connectbd.js           # MongoDB connection
│   │
│   ├── models/                    # Mongoose models
│   │   ├── User.js                # User model
│   │   ├── Project.js             # Project model
│   │   ├── Material.js            # Material model
│   │   ├── Furniture.js           # Furniture model
│   │   └── Order.js               # Order model
│   │
│   ├── routes/                     # API routes
│   │   ├── auth.js                # Authentication routes
│   │   ├── projects.js            # Project routes
│   │   ├── materials.js           # Material routes
│   │   ├── furniture.js           # Furniture routes
│   │   ├── orders.js              # Order routes
│   │   └── upload.js              # File upload routes
│   │
│   ├── middleware/                 # Express middleware
│   │   └── auth.js                # Authentication middleware
│   │
│   ├── uploads/                    # Uploaded files
│   │   └── textures/              # Texture images
│   │       └── [28 texture files]
│   │
│   └── package.json
│
├── 📱 mobile/                       # Mobile Application (React Native + Expo)
│   ├── app/                        # App router (Expo Router)
│   │   ├── _layout.tsx            # Root layout
│   │   ├── index.tsx              # Home screen
│   │   │
│   │   ├── (auth)/                # Authentication group
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   │
│   │   ├── (tabs)/                # Tab navigation group
│   │   │   ├── _layout.tsx
│   │   │   ├── our-templates.tsx
│   │   │   ├── products.tsx
│   │   │   └── profile.tsx
│   │   │
│   │   ├── category/              # Category screens
│   │   │   ├── ceilings.tsx
│   │   │   ├── floors.tsx
│   │   │   ├── furniture.tsx
│   │   │   └── walls.tsx
│   │   │
│   │   ├── orders/                # Orders screen
│   │   │   └── index.tsx
│   │   │
│   │   └── project/               # Project detail screen
│   │       └── [id].tsx
│   │
│   ├── components/                 # React Native components
│   │   ├── MaterialCard.tsx
│   │   ├── MaterialCarouselItem.tsx
│   │   ├── ProductCard.tsx
│   │   └── TopBar.tsx
│   │
│   ├── context/                    # React Contexts
│   │   └── AuthContext.tsx
│   │
│   ├── services/                   # API services
│   │   ├── api.ts                 # Base API client
│   │   ├── authService.ts
│   │   ├── projectsService.ts
│   │   ├── materialsService.ts
│   │   ├── furnitureService.ts
│   │   └── ordersService.ts
│   │
│   ├── assets/                     # Static assets
│   │   ├── fonts/                 # Custom fonts
│   │   │   └── SpaceMono-Regular.ttf
│   │   └── images/               # Image assets
│   │       └── [8 image files]
│   │
│   ├── app.json                   # Expo configuration
│   ├── package.json
│   ├── babel.config.js           # Babel configuration
│   ├── metro.config.js           # Metro bundler configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── tsconfig.json             # TypeScript configuration
│
├── 🎨 Admin_Dashboard/              # Admin Dashboard (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/             # Admin-specific components
│   │   │   │   └── [8 admin components]
│   │   │   │
│   │   │   ├── ui/                # UI components
│   │   │   │   └── [44 UI components]
│   │   │   │
│   │   │   └── home.tsx
│   │   │
│   │   ├── pages/                  # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   └── LoginPage.tsx
│   │   │
│   │   ├── contexts/              # React Contexts
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── data/                  # Mock data
│   │   │   └── mockData.ts
│   │   │
│   │   ├── lib/                   # Utility libraries
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── types/                  # TypeScript types
│   │   │   ├── admin.ts
│   │   │   └── supabase.ts
│   │   │
│   │   └── stories/               # Storybook stories
│   │       └── [39 story files]
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── 📄 Root Files
    └── 1211(1).mp4                # Demo video
```

## Technology Stack

### Frontend (Web)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **3D Rendering**: Three.js / React Three Fiber
- **Routing**: React Router
- **State Management**: React Context API
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT
- **File Upload**: Multer

### Mobile
- **Framework**: React Native
- **Platform**: Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)

### Admin Dashboard
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

## Key Features

- 🎨 **3D Room Configurator**: Interactive 3D room design with real-time visualization
- 🏠 **Material Selection**: Choose from various materials for walls, floors, and ceilings
- 🪑 **Furniture Placement**: Add and arrange furniture in 3D space
- 💰 **Cost Estimation**: Automatic calculation of project costs
- 📊 **Project Management**: Save, view, and manage design projects
- 👥 **Multi-Role System**: Admin, Provider, and User roles
- 📱 **Cross-Platform**: Web and mobile applications
- 🎯 **Order Management**: Create orders from projects

## Run Locally

**Prerequisites:** Node.js, MongoDB

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend (Web)
```bash
cd front_web
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

### Admin Dashboard
```bash
cd Admin_Dashboard
npm install
npm run dev
```

## View your app in AI Studio

https://ai.studio/apps/drive/1LyymRxCNJVknyQibZ1kITVgLyYSIw4x3

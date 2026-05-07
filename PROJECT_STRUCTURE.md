# Complete Project Structure & Documentation

AI-Powered Superannuation Advisor Dashboard - Full Project Architecture

## 📂 Complete File Tree

```
e:\PROJECTS\mitushibi/
│
├── 📄 Configuration & Setup Files
│   ├── .env                          # Environment variables (local)
│   ├── .gitignore                    # Git ignore rules
│   ├── .git/                         # Git repository
│   ├── package.json                  # Node.js dependencies & scripts
│   ├── package-lock.json             # Locked dependencies
│   ├── bun.lockb                     # Bun package manager lock file
│   ├── tsconfig.json                 # TypeScript config (root)
│   ├── tsconfig.app.json             # TypeScript config (app)
│   ├── tsconfig.node.json            # TypeScript config (node)
│   ├── vite.config.ts                # Vite build configuration
│   ├── tailwind.config.ts            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── eslint.config.js              # ESLint configuration
│   ├── components.json               # Component configuration
│   ├── index.html                    # HTML entry point
│   └── tsc_output.txt                # TypeScript compilation output
│
├── 📚 Documentation
│   ├── README.md                     # Main project README
│   ├── PROJECT_STRUCTURE.md          # This file - complete architecture
│   ├── SUPABASE_SETUP.md             # Supabase database setup guide
│   ├── manual_setup_instructions.md  # Manual setup documentation
│   ├── ML_TO_LLM_DATA_FLOW.md        # ML pipeline data flow documentation
│   └── backend/
│       └── ML_TO_LLM_DATA_FLOW.md    # ML to LLM data flow
│
├── 🗄️ Database & SQL
│   ├── add_password_column.sql       # Database migration: add password
│   ├── supabase_setup.sql            # Supabase initial setup
│   ├── supabase_table_fix.sql        # Supabase table fixes
│   └── simple_supabase_setup.sql     # Simplified Supabase setup
│
├── 📊 Data Files
│   ├── case1.csv                     # Sample dataset (500+ users)
│   ├── case1.xlsx                    # Sample dataset (Excel format)
│   └── backend/
│       └── case1.csv                 # Backend copy of dataset
│
├── 🔧 Development & Setup Scripts
│   ├── setup.bat                     # Windows setup script
│   ├── setup.sh                      # Linux/Mac setup script
│   ├── debug_login.js                # Login debugging script
│   ├── test_supabase_insert.js       # Supabase insert testing
│   ├── backend/
│   │   ├── setup.bat                 # Backend Windows setup
│   │   ├── setup.sh                  # Backend Linux/Mac setup
│   │   └── code_dump.txt             # Code dump for debugging
│   └── code_dump.txt                 # Code dump for debugging
│
├── 🧪 Test Files
│   ├── test_supabase_insert.js       # Test Supabase inserts
│   ├── backend/
│   │   ├── test_supabase.py          # Supabase connection test
│   │   ├── test_insurance_coverage.py# Insurance coverage testing
│   │   ├── test_ml_integration.py    # ML model integration test
│   │   ├── test_nan_fix.py           # NaN handling test
│   │   ├── test_new_user_chat.py     # New user chat testing
│   │   ├── test_peer_stats_api.py    # Peer stats API test
│   │   └── test_signup.json          # Signup test data
│   └── tsc_output.txt                # TypeScript output
│
├── 📁 src/ (Frontend - React/TypeScript)
│   │
│   ├── App.tsx                       # Root React component
│   ├── main.tsx                      # React entry point
│   ├── vite-env.d.ts                 # Vite environment definitions
│   ├── index.css                     # Global CSS
│   │
│   ├── 🎨 components/                # React components
│   │   │
│   │   ├── auth/                     # Authentication components
│   │   │   ├── AdminLoginModal.tsx   # Admin login modal
│   │   │   └── SignupForm.tsx        # User signup form
│   │   │
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── AdvancedInsights.tsx  # Advanced analytics display
│   │   │   ├── ADVANCED_INSIGHTS_README.md  # AdvancedInsights documentation
│   │   │   ├── AssetAllocation.tsx   # Asset allocation visualization
│   │   │   ├── ChatbotPage.tsx       # AI chatbot interface
│   │   │   ├── ChatbotPageWithSpeech.tsx # Voice-enabled chatbot
│   │   │   ├── DashboardHeader.tsx   # Dashboard header/nav
│   │   │   ├── EducationPage.tsx     # Educational resources
│   │   │   ├── FloatingChatButton.tsx# Floating chat button
│   │   │   ├── GoalsPage.tsx         # Financial goals management
│   │   │   ├── MetricsGrid.tsx       # Key metrics display
│   │   │   ├── NavigationTabs.tsx    # Main navigation tabs
│   │   │   ├── PortfolioGrowth.tsx   # Portfolio growth chart
│   │   │   ├── PortfolioPage.tsx     # Portfolio overview
│   │   │   ├── QuickActions.tsx      # Quick action buttons
│   │   │   ├── RiskPage.tsx          # Risk assessment page
│   │   │   ├── SummaryCard.tsx       # Summary card component
│   │   │   ├── UserSelection.tsx     # User profile selector
│   │   │   └── UserSelectionPanel.tsx# User selection panel
│   │   │
│   │   ├── debug/                    # Debug components
│   │   │   └── AdminDebug.tsx        # Admin debug panel
│   │   │
│   │   └── ui/                       # Reusable UI components (shadcn/ui)
│   │       ├── accordion.tsx         # Accordion component
│   │       ├── alert-dialog.tsx      # Alert dialog
│   │       ├── alert.tsx             # Alert component
│   │       ├── aspect-ratio.tsx      # Aspect ratio wrapper
│   │       ├── avatar.tsx            # Avatar component
│   │       ├── badge.tsx             # Badge component
│   │       ├── breadcrumb.tsx        # Breadcrumb navigation
│   │       ├── button.tsx            # Button component
│   │       ├── calendar.tsx          # Calendar component
│   │       ├── card.tsx              # Card component
│   │       ├── carousel.tsx          # Carousel component
│   │       ├── chart.tsx             # Chart component
│   │       ├── checkbox.tsx          # Checkbox component
│   │       ├── collapsible.tsx       # Collapsible component
│   │       ├── command.tsx           # Command palette
│   │       ├── context-menu.tsx      # Context menu
│   │       ├── dialog.tsx            # Dialog component
│   │       ├── drawer.tsx            # Drawer component
│   │       ├── dropdown-menu.tsx     # Dropdown menu
│   │       ├── form.tsx              # Form component
│   │       ├── hover-card.tsx        # Hover card
│   │       ├── input-otp.tsx         # OTP input
│   │       ├── input.tsx             # Text input
│   │       ├── label.tsx             # Form label
│   │       ├── menubar.tsx           # Menu bar
│   │       ├── navigation-menu.tsx   # Navigation menu
│   │       ├── pagination.tsx        # Pagination
│   │       ├── popover.tsx           # Popover component
│   │       ├── progress.tsx          # Progress bar
│   │       ├── radio-group.tsx       # Radio group
│   │       ├── resizable.tsx         # Resizable container
│   │       ├── scroll-area.tsx       # Scroll area
│   │       ├── select.tsx            # Select dropdown
│   │       ├── separator.tsx         # Separator divider
│   │       ├── sheet.tsx             # Sheet component
│   │       ├── sidebar.tsx           # Sidebar layout
│   │       ├── skeleton.tsx          # Loading skeleton
│   │       ├── slider.tsx            # Slider component
│   │       ├── sonner.tsx            # Toast notifications
│   │       ├── switch.tsx            # Toggle switch
│   │       ├── table.tsx             # Table component
│   │       ├── tabs.tsx              # Tabs component
│   │       ├── textarea.tsx          # Textarea input
│   │       ├── toast.tsx             # Toast component
│   │       ├── toaster.tsx           # Toast container
│   │       ├── toggle-group.tsx      # Toggle group
│   │       ├── toggle.tsx            # Toggle button
│   │       ├── tooltip.tsx           # Tooltip component
│   │       └── use-toast.ts          # Toast hook
│   │
│   ├── 🎯 contexts/                  # React Context providers
│   │   ├── AdminAuthContext.tsx      # Admin authentication context
│   │   ├── AuthContext.tsx           # User authentication context
│   │   └── ThemeContext.tsx          # Theme (light/dark) context
│   │
│   ├── 🪝 hooks/                     # Custom React hooks
│   │   ├── use-mobile.tsx            # Mobile detection hook
│   │   └── use-toast.ts              # Toast notification hook
│   │
│   ├── 📦 lib/                       # Utility functions & services
│   │   ├── supabase.ts               # Supabase client configuration
│   │   └── utils.ts                  # General utility functions
│   │
│   ├── 📄 pages/                     # Page components
│   │   ├── Admin.tsx                 # Admin dashboard page
│   │   ├── Dashboard.tsx             # Main dashboard page
│   │   ├── Index.tsx                 # Index/landing page
│   │   ├── Login.tsx                 # Login page
│   │   ├── NotFound.tsx              # 404 not found page
│   │   ├── ProfileSetup.tsx          # User profile setup page
│   │   ├── RetirementCalculator.tsx  # Retirement calculator page
│   │   ├── Signup.tsx                # User signup page
│   │   └── UserManager.tsx           # User management page
│   │
│   └── 🔗 services/                  # API service layer
│       ├── adminService.ts           # Admin API methods
│       ├── dataService.ts            # Data service & calculations
│       └── supabaseService.ts        # Supabase database service
│
├── 📁 backend/ (Python - FastAPI/ML)
│   │
│   ├── 🐍 Core API & ML
│   │   ├── api.py                    # FastAPI server (main backend)
│   │   ├── main.py                   # Alternative entry point
│   │   ├── inference.py              # ML model inference engine
│   │   ├── train.py                  # ML model training script
│   │   ├── integrated_ml_pipeline.py # Complete ML pipeline
│   │   ├── advanced_ml_models.py     # Advanced ML model implementations
│   │   └── create_table_sql.py       # SQL table creation helper
│   │
│   ├── 🤖 AI & NLP
│   │   ├── chat_router.py            # Chatbot routing & logic
│   │   └── azure_speech.py           # Azure Speech Services integration
│   │
│   ├── 📧 Services
│   │   ├── email_service.py          # Email sending service
│   │   └── scheduler.py              # Task scheduler for emails
│   │
│   ├── 🗄️ Database
│   │   ├── supabase_config.py        # Supabase configuration
│   │   ├── setup_supabase_database.py# Database setup script
│   │   ├── setup_database.py         # Alternative setup script
│   │   ├── discover_tables.py        # Table discovery utility
│   │   └── simple_supabase_setup.sql # SQL setup file
│   │
│   ├── ⚙️ Configuration & Setup
│   │   ├── requirements.txt          # Python dependencies
│   │   ├── .env                      # Environment variables
│   │   ├── setup.bat                 # Windows setup script
│   │   ├── setup.sh                  # Linux/Mac setup script
│   │   ├── .dockerignore             # Docker ignore rules
│   │   └── Dockerfile                # Docker configuration
│   │
│   ├── 📊 Data & Models
│   │   ├── case1.csv                 # Training dataset (500+ users)
│   │   └── models/                   # Trained ML models (pickle files)
│   │       ├── advanced_label_encoders.pkl        # Label encoders
│   │       ├── anomaly_detection_model.pkl        # Anomaly detection
│   │       ├── churn_risk_model.pkl               # Churn prediction
│   │       ├── financial_health_model.pkl         # Financial health
│   │       ├── fund_recommendation_model.pkl      # Fund recommendations
│   │       ├── investment_recommendation_model.pkl# Investment advice
│   │       ├── investment_scaler.pkl              # Feature scaler
│   │       ├── kmeans_model.pkl                   # KMeans clustering
│   │       ├── label_encoders.pkl                 # Category encoding
│   │       ├── monte_carlo_config.pkl             # Monte Carlo params
│   │       ├── peer_matching_model.pkl            # Peer matching
│   │       ├── portfolio_optimization_model.pkl   # Portfolio optimization
│   │       ├── risk_prediction_model.pkl          # Risk assessment
│   │       ├── risk_scaler.pkl                    # Risk feature scaler
│   │       └── scaler.pkl                         # General scaler
│   │
│   ├── 🧪 Testing & Debugging
│   │   ├── test_supabase.py          # Supabase connection test
│   │   ├── test_insurance_coverage.py# Insurance coverage test
│   │   ├── test_ml_integration.py    # ML integration test
│   │   ├── test_nan_fix.py           # NaN handling test
│   │   ├── test_new_user_chat.py     # Chat functionality test
│   │   ├── test_peer_stats_api.py    # Peer stats API test
│   │   └── test_signup.json          # Test data
│   │
│   ├── 📚 Documentation
│   │   ├── manual_setup_instructions.md # Manual setup guide
│   │   ├── ML_TO_LLM_DATA_FLOW.md       # ML pipeline documentation
│   │   └── code_dump.txt                # Code reference dump
│   │
│   ├── 📁 venv/                      # Python virtual environment
│   └── 📁 __pycache__/               # Python cache files
│
├── 📁 public/
│   └── robots.txt                    # SEO robots file
│
├── 📁 node_modules/                  # Node.js dependencies (auto-generated)
│
├── 📁 .venv/                         # Python virtual environment (root)
│
└── 📁 .git/                          # Git repository (version control)
```

---

## 🎯 Directory Purpose Guide

### Root Level

| Directory/File   | Purpose                                |
| ---------------- | -------------------------------------- |
| `src/`           | Frontend React/TypeScript application  |
| `backend/`       | Python FastAPI backend with ML models  |
| `public/`        | Static public assets                   |
| `package.json`   | Node.js project dependencies & scripts |
| `tsconfig.json`  | TypeScript configuration               |
| `vite.config.ts` | Build tool configuration               |
| `.env`           | Environment variables                  |

### Frontend Structure (`src/`)

| Directory     | Purpose                           |
| ------------- | --------------------------------- |
| `components/` | Reusable React components         |
| `pages/`      | Full page components (routes)     |
| `services/`   | API service layer & data fetching |
| `contexts/`   | React Context providers (state)   |
| `hooks/`      | Custom React hooks                |
| `lib/`        | Utility functions & helpers       |

### Dashboard Components (`src/components/dashboard/`)

| Component              | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `AdvancedInsights.tsx` | ML-powered analytics & insights display |
| `ChatbotPage.tsx`      | AI chatbot interface                    |
| `PortfolioPage.tsx`    | Investment portfolio visualization      |
| `RiskPage.tsx`         | Risk assessment & management            |
| `GoalsPage.tsx`        | Financial goals tracking                |
| `EducationPage.tsx`    | Educational resources                   |
| `MetricsGrid.tsx`      | Key financial metrics                   |
| `UserSelection.tsx`    | User profile switcher                   |

### UI Components (`src/components/ui/`)

- Complete set of **shadcn/ui** components
- Fully accessible and customizable
- Built on Radix UI primitives
- 48+ component types available

### Backend Structure (`backend/`)

| Directory          | Purpose                          |
| ------------------ | -------------------------------- |
| `api.py`           | FastAPI server & endpoints       |
| `train.py`         | ML model training                |
| `inference.py`     | ML model predictions             |
| `chat_router.py`   | Chatbot AI logic                 |
| `email_service.py` | Automated email sending          |
| `models/`          | Trained ML models (pickle files) |
| `requirements.txt` | Python dependencies              |

### ML Models (`backend/models/`)

| Model                              | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `financial_health_model.pkl`       | Financial wellness scoring      |
| `churn_risk_model.pkl`             | User churn prediction           |
| `anomaly_detection_model.pkl`      | Fraud/anomaly detection         |
| `fund_recommendation_model.pkl`    | Investment fund recommendations |
| `portfolio_optimization_model.pkl` | Asset allocation optimization   |
| `peer_matching_model.pkl`          | Similar user identification     |
| `kmeans_model.pkl`                 | User segmentation clustering    |
| `risk_prediction_model.pkl`        | Risk tolerance assessment       |

---

## 📊 File Statistics

### Frontend Files

- **Total Components**: 50+
  - Dashboard: 18
  - UI: 48
  - Auth: 2
  - Debug: 1
- **Total Pages**: 9
- **Services**: 3
- **Contexts**: 3
- **Hooks**: 2
- **Configuration Files**: 7

### Backend Files

- **Python Modules**: 15+
  - Core API: 5
  - AI/NLP: 2
  - Services: 2
  - Database: 5
- **ML Models**: 15 trained models
- **Test Files**: 7
- **Configuration Files**: 4

### Documentation Files

- README.md
- PROJECT_STRUCTURE.md (this file)
- ADVANCED_INSIGHTS_README.md
- SUPABASE_SETUP.md
- ML_TO_LLM_DATA_FLOW.md
- manual_setup_instructions.md

---

## 🔗 Key Dependencies

### Frontend (package.json)

- **React**: 18+ UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Utility styling
- **Shadcn/ui**: UI components
- **Recharts**: Data visualization
- **Lucide React**: Icons
- **Supabase**: Database & auth

### Backend (requirements.txt)

- **FastAPI**: Web framework
- **Scikit-learn**: ML models
- **XGBoost**: Gradient boosting
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Supabase-py**: Database client
- **Azure-cognitiveservices**: Speech API
- **Hugging Face**: LLM models

---

## 🚀 Key API Endpoints

### ML & Analytics (`/api`)

```
GET  /user/{user_id}                 - User profile
GET  /predict/{user_id}              - Predictions & pension
GET  /summary/{user_id}              - Dashboard summary
GET  /peer_stats/{user_id}           - Peer comparison
GET  /risk/{user_id}                 - Risk assessment
GET  /advanced-analysis/{user_id}    - Advanced insights
POST /simulate                       - Projection simulator
GET  /recommendations/{user_id}      - Recommendations
```

### Speech Services (`/api`)

```
POST /text-to-speech                 - Text to speech
POST /speech-to-text                 - Speech to text
GET  /voices                         - Available voices
```

### Email (`/api`)

```
GET  /trigger-email                  - Send email
GET  /trigger-email/{source}         - Send with source
POST /send-email                     - Custom email
GET  /health                         - System status
```

---

## 📈 Technology Stack

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **UI Library**: Shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: React Context + Hooks
- **Database**: Supabase (PostgreSQL)

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.9+
- **ML Libraries**: Scikit-learn, XGBoost, Pandas
- **LLM**: Hugging Face (Llama 3)
- **Voice**: Azure Speech Services
- **Database**: Supabase (PostgreSQL)
- **Email**: SMTP
- **Scheduling**: APScheduler

### DevOps

- **Version Control**: Git
- **Containerization**: Docker
- **Package Managers**: npm, pip
- **Build Tools**: Vite, TypeScript
- **Code Quality**: ESLint, TypeScript strict mode

---

## 💾 Data Flow

```
User (Frontend)
    ↓
React Components (src/components/)
    ↓
Data Services (src/services/dataService.ts)
    ↓
FastAPI Backend (backend/api.py)
    ↓
ML Models (backend/models/*.pkl)
    ↓
Inference Engine (backend/inference.py)
    ↓
Supabase Database (PostgreSQL)
    ↓
Response to Frontend
    ↓
UI Rendering & Display
```

---

## 🔐 Environment Variables

### Frontend (`.env`)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AZURE_SPEECH_KEY=
VITE_AZURE_SPEECH_REGION=
```

### Backend (`backend/.env`)

```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
HF_TOKEN=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
NEWS_API_KEY=
GEMINI_API_KEY=
```

---

## 📱 Page Routes

| Route              | Component                | Purpose           |
| ------------------ | ------------------------ | ----------------- |
| `/`                | Index.tsx                | Landing page      |
| `/login`           | Login.tsx                | User login        |
| `/signup`          | Signup.tsx               | User registration |
| `/profile-setup`   | ProfileSetup.tsx         | Profile creation  |
| `/dashboard`       | Dashboard.tsx            | Main dashboard    |
| `/admin`           | Admin.tsx                | Admin panel       |
| `/user-manager`    | UserManager.tsx          | Manage users      |
| `/retirement-calc` | RetirementCalculator.tsx | Calculator        |
| `*`                | NotFound.tsx             | 404 page          |

---

## 🎯 Feature Modules

### Dashboard Features

- **Summary Card**: Retirement goals & progress
- **Metrics Grid**: Key financial metrics
- **Portfolio**: Asset allocation & growth
- **Goals**: Financial goals tracking
- **Education**: Learning resources
- **Risk**: Risk assessment tools
- **Chatbot**: AI advisor with voice
- **Advanced Insights**: ML analytics

### Authentication

- User signup & login
- Admin authentication
- Session management
- Role-based access

### Data Analysis

- Financial health scoring
- Risk assessment
- Peer comparison
- Anomaly detection
- Churn prediction
- Fund recommendations
- Portfolio optimization
- Monte Carlo simulation

### Communication

- Text-to-speech (voice)
- Speech-to-text (voice input)
- Chatbot AI responses
- Automated emails

---

## 🔄 Development Workflow

### Setup

```bash
# Frontend
npm install
npm run dev

# Backend
pip install -r requirements.txt
python backend/api.py
```

### Build

```bash
npm run build      # Frontend build
# Backend requires no build step
```

### Testing

```bash
cd backend
python test_supabase.py
python test_ml_integration.py
```

---

## 📚 Documentation Files Guide

| File                           | Contains                          |
| ------------------------------ | --------------------------------- |
| `README.md`                    | Project overview & quick start    |
| `PROJECT_STRUCTURE.md`         | This file - complete architecture |
| `ADVANCED_INSIGHTS_README.md`  | AdvancedInsights component docs   |
| `SUPABASE_SETUP.md`            | Database setup guide              |
| `ML_TO_LLM_DATA_FLOW.md`       | ML pipeline documentation         |
| `manual_setup_instructions.md` | Manual setup steps                |

---

## 🎓 Learning Resources

### Component Development

- Check `src/components/dashboard/` for complex examples
- `src/components/ui/` for shadcn/ui usage
- TypeScript types in component interfaces

### Backend Development

- `backend/api.py` for FastAPI patterns
- `backend/inference.py` for ML model usage
- `backend/chat_router.py` for LLM integration

### Data Services

- `src/services/dataService.ts` for calculations
- `src/services/supabaseService.ts` for database
- `backend/train.py` for ML model training

---

## ✅ Quality Assurance

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Tailwind CSS best practices
- React hooks best practices
- Component modularity

### Testing

- Backend test suite in `backend/test_*.py`
- Data validation tests
- API endpoint tests
- ML model tests

### Documentation

- Component README files
- Inline code comments
- Architecture documentation
- Setup guides

---

## 🚀 Performance Optimization

### Frontend

- Code splitting with Vite
- Component lazy loading
- Image optimization
- CSS optimization with Tailwind

### Backend

- Model caching
- Database connection pooling
- Async processing
- Response compression

---

## 📄 License

Part of the MUFG Hackathon. Designed for demonstration and educational purposes.

---

**Last Updated**: May 2026  
**Project Version**: 1.0  
**Status**: Production Ready  
**Total Files**: 200+  
**Total Components**: 100+  
**Total Python Modules**: 15+

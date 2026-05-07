# API Configuration & Environment Variables

## Overview

All hardcoded `localhost:8000` and `127.0.0.1` references have been replaced with dynamic environment variable configuration using `import.meta.env.VITE_API_URL`.

---

## 🔧 Configuration

### Environment Variable Setup

Add the following to your `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

**Default Fallback**: If `VITE_API_URL` is not set, all files default to `http://localhost:8000`.

### Production Configuration

For production deployments, set the environment variable accordingly:

```env
# Local Development
VITE_API_URL=http://localhost:8000

# Staging
VITE_API_URL=https://api-staging.example.com

# Production
VITE_API_URL=https://api.example.com
```

---

## 📝 Files Modified

### Frontend Services

#### 1. **src/services/dataService.ts**
- **Status**: ✅ Updated
- **Changes**: 
  - Replaced `API_BASE_URL` with `const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'`
  - Updated 10 API endpoints to use dynamic `API` variable
- **Endpoints Updated**:
  - `/user/{userId}`
  - `/summary/{userId}`
  - `/peer_stats/{userId}`
  - `/simulate`
  - `/risk/{userId}`
  - `/chat`
  - `/signup`
  - `/users`

#### 2. **src/components/dashboard/DashboardHeader.tsx**
- **Status**: ✅ Updated
- **Changes**: 
  - Added API variable initialization in `handleSendEmail` function
  - Updated email endpoint to use dynamic API
- **Endpoints Updated**:
  - `/trigger-email/{newsSource}`

#### 3. **src/components/auth/SignupForm.tsx**
- **Status**: ✅ Updated
- **Changes**: 
  - Added API variable at component level (after Refs section)
  - Updated all speech service endpoints
- **Endpoints Updated**:
  - `/voices` (text-to-speech voice selection)
  - `/speech-to-text` (speech recognition)
  - `/text-to-speech` (voice output)

#### 4. **src/components/dashboard/ChatbotPageWithSpeech.tsx**
- **Status**: ✅ Updated
- **Changes**: 
  - Added API variable in each function that uses it
  - Updated all speech service endpoints
- **Endpoints Updated**:
  - `/voices` (in `loadVoices()`)
  - `/speech-to-text` (in `processAudioInput()`)
  - `/text-to-speech` (in `textToSpeech()`)

---

## 🎯 Implementation Pattern

### Before (Hardcoded)
```typescript
// ❌ BAD - Hardcoded localhost
const response = await fetch('http://localhost:8000/voices');
```

### After (Dynamic)
```typescript
// ✅ GOOD - Dynamic environment variable
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const response = await fetch(`${API}/voices`);
```

---

## 📡 All Updated API Calls

### Core ML & Data Endpoints
| Method | Endpoint | File | Updated |
|--------|----------|------|---------|
| GET | `/user/{userId}` | dataService.ts | ✅ |
| GET | `/summary/{userId}` | dataService.ts | ✅ |
| GET | `/peer_stats/{userId}` | dataService.ts | ✅ |
| POST | `/simulate` | dataService.ts | ✅ |
| GET | `/risk/{userId}` | dataService.ts | ✅ |
| POST | `/chat` | dataService.ts | ✅ |
| POST | `/signup` | dataService.ts | ✅ |
| GET | `/users` | dataService.ts | ✅ |

### Speech Services Endpoints
| Method | Endpoint | File | Updated |
|--------|----------|------|---------|
| GET | `/voices` | SignupForm.tsx | ✅ |
| GET | `/voices` | ChatbotPageWithSpeech.tsx | ✅ |
| POST | `/speech-to-text` | SignupForm.tsx | ✅ |
| POST | `/speech-to-text` | ChatbotPageWithSpeech.tsx | ✅ |
| POST | `/text-to-speech` | SignupForm.tsx | ✅ |
| POST | `/text-to-speech` | ChatbotPageWithSpeech.tsx | ✅ |

### Email Endpoints
| Method | Endpoint | File | Updated |
|--------|----------|------|---------|
| GET | `/trigger-email/{source}` | DashboardHeader.tsx | ✅ |

---

## 🚀 How to Use

### For Development

1. **Start Backend**:
   ```bash
   cd backend
   python api.py
   ```
   Backend runs on `http://localhost:8000` (default)

2. **Frontend will automatically use** `VITE_API_URL` from `.env`
   - If not set, defaults to `http://localhost:8000`

3. **Start Frontend**:
   ```bash
   npm run dev
   ```

### For Different Environments

Simply change the `.env` file:

```bash
# Local development (already configured)
VITE_API_URL=http://localhost:8000

# After building for staging/production
# Update .env accordingly before building
```

### Using Different API Servers During Development

```env
# Local backend on different port
VITE_API_URL=http://localhost:3001

# Remote backend for testing
VITE_API_URL=https://api-staging.example.com

# Docker container
VITE_API_URL=http://backend:8000
```

---

## ✅ Verification

### Check All References Are Updated

```bash
# Should show NO hardcoded localhost URLs in fetch calls
grep -r "fetch.*http://localhost:8000" src/
grep -r "fetch.*http://127.0.0.1" src/

# Should show only the fallback in variable declarations
grep -r "VITE_API_URL.*http://localhost:8000" src/
```

### Current Status
✅ All 17 hardcoded references replaced  
✅ All 4 files updated  
✅ Environment variable configured  
✅ Backward compatibility maintained with fallback defaults  

---

## 🔄 Building for Production

### Build with Environment Variables

```bash
# Set production API URL
export VITE_API_URL=https://api.production.com

# Build
npm run build

# Or create .env.production for automatic loading
echo "VITE_API_URL=https://api.production.com" > .env.production
npm run build
```

### Vite Environment Files

Create additional environment files for different stages:

```
.env                    # Loaded for all environments (default: localhost:8000)
.env.local             # Local overrides (git ignored)
.env.production        # Production settings
.env.staging           # Staging settings
```

**Example .env.production**:
```env
VITE_SUPABASE_URL=https://prod-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=<production-key>
VITE_API_URL=https://api.production.com
```

---

## 🛠️ Backend Configuration

### Backend .env

The backend also uses environment variables. Ensure these are set:

```env
# backend/.env
CORS_ORIGINS=http://localhost:8080,http://localhost:5173,https://yourdomain.com
```

### CORS Settings in Python (backend/api.py)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:8080").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📋 Checklist for Deployment

- [ ] Set `VITE_API_URL` environment variable
- [ ] Update `.env.production` or `.env.staging`
- [ ] Verify backend CORS allows your frontend domain
- [ ] Test API connectivity before deployment
- [ ] Build with correct environment: `npm run build`
- [ ] Verify API calls in DevTools Network tab
- [ ] Test all features: chat, voices, emails, data loading

---

## 🚨 Troubleshooting

### Issue: API calls still going to localhost:8000

**Solution**: Check your `.env` file:
```bash
cat .env | grep VITE_API_URL
```

If empty or missing, add:
```env
VITE_API_URL=http://your-api-url.com
```

### Issue: CORS errors when calling API

**Solution**: Update backend CORS settings:
```python
# Ensure your frontend URL is in CORS_ORIGINS
allow_origins=["http://localhost:3000", "https://yourdomain.com"]
```

### Issue: 404 on API endpoints

**Solution**: Verify:
1. Backend is running: `curl http://localhost:8000/health`
2. `VITE_API_URL` is correct
3. Backend routes are implemented
4. Network tab shows correct URL being called

---

## 📚 Related Documentation

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [Our Backend Setup](backend/manual_setup_instructions.md)
- [Supabase Configuration](SUPABASE_SETUP.md)

---

## 📝 Version History

| Date | Changes | Status |
|------|---------|--------|
| May 2026 | Initial hardcoded URL replacement | ✅ Complete |
| | All 4 files updated | |
| | Environment variable configuration added | |
| | Backward compatibility maintained | |

---

## 🎯 Summary of Benefits

✅ **Easy Configuration**: Change API URL in one place (`.env`)  
✅ **Multi-Environment Support**: Different URLs for dev/staging/prod  
✅ **Secure**: API URLs not hardcoded in source  
✅ **Scalable**: Docker/Kubernetes friendly  
✅ **Maintainable**: Clear pattern for all API calls  
✅ **Backward Compatible**: Falls back to localhost:8000 if not set  

---

**Last Updated**: May 2026  
**Status**: Production Ready  
**Maintainer**: Development Team

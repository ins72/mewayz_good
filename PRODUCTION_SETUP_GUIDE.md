# 🚀 MEWAYZ V2 - Production Setup Guide

## 📋 **Overview**

This guide will help you transform MEWAYZ V2 from a development platform with mock data to a production-ready application with real database CRUD operations.

## 🎯 **Current State Analysis**

### ✅ **What's Already Production Ready:**
- **Backend**: FastAPI with MongoDB integration, authentication, and CRUD operations
- **API Endpoints**: Complete REST API for all major features
- **Security**: JWT authentication, rate limiting, CORS configuration
- **Database Models**: Well-structured MongoDB models with ODMantic

### ❌ **What Needs to be Fixed:**
- **Database Connection**: MongoDB not running/configured
- **Frontend**: 100% mock data usage across all components
- **API Integration**: No real API calls in frontend components

---

## 🔧 **Step 1: Database Setup**

### **Option A: Local MongoDB Installation**

1. **Install MongoDB Community Edition:**
   ```bash
   # Windows (using Chocolatey)
   choco install mongodb
   
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   ```

2. **Start MongoDB Service:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   ```

### **Option B: Docker MongoDB (Recommended)**

1. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:latest
       container_name: mewayz_mongodb
       ports:
         - "27017:27017"
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD: password123
       volumes:
         - mongodb_data:/data/db
   
   volumes:
     mongodb_data:
   ```

2. **Start MongoDB:**
   ```bash
   docker-compose up -d mongodb
   ```

### **Option C: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update environment variables

---

## 🚀 **Step 2: Backend Production Setup**

### **1. Run Production Setup Script**
```bash
cd backend
python scripts/setup_production.py
```

This script will:
- ✅ Verify database connection
- ✅ Create admin user
- ✅ Seed categories and products
- ✅ Create sample users
- ✅ Verify API endpoints

### **2. Start Backend Server**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8002
```

### **3. Verify Backend Health**
```bash
curl http://localhost:8002/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🎨 **Step 3: Frontend Production Setup**

### **1. Update Environment Variables**
Create `.env.local` in frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8002/api/v1
NEXT_PUBLIC_ENVIRONMENT=production
```

### **2. Install Dependencies**
```bash
cd frontend
npm install
```

### **3. Start Frontend Development Server**
```bash
npm run dev
```

---

## 🔄 **Step 4: Replace Mock Data with Real API Calls**

### **Components Already Updated:**
- ✅ API Service Layer (`frontend/lib/api.ts`)
- ✅ React Hooks (`frontend/hooks/useApi.ts`)

### **Components to Update:**

#### **1. Products Page**
**File:** `frontend/templates/Products/OverviewPage/Products/index.tsx`

**Before (Mock Data):**
```typescript
import { products } from "@/mocks/products";
```

**After (Real API):**
```typescript
import { useProducts } from "@/hooks/useApi";

const { data: products, loading, error, refetch } = useProducts({
  page: 1,
  limit: 20
});
```

#### **2. Customers Page**
**File:** `frontend/templates/Customers/OverviewPage/index.tsx`

**Before (Mock Data):**
```typescript
import { customers } from "@/mocks/customers";
```

**After (Real API):**
```typescript
import { useCustomers } from "@/hooks/useApi";

const { data: customers, loading, error } = useCustomers({
  page: 1,
  limit: 20
});
```

#### **3. Messages Page**
**File:** `frontend/templates/MessagesPage/index.tsx`

**Before (Mock Data):**
```typescript
import { messages } from "@/mocks/messages";
```

**After (Real API):**
```typescript
import { useMessages } from "@/hooks/useApi";

const { data: messages, loading, error } = useMessages({
  page: 1,
  limit: 20
});
```

#### **4. Notifications Component**
**File:** `frontend/components/Header/Notifications/index.tsx`

**Before (Mock Data):**
```typescript
import { newNotifications } from "@/mocks/notifications";
```

**After (Real API):**
```typescript
import { useNotifications } from "@/hooks/useApi";

const { data: notifications, loading, error } = useNotifications({
  page: 1,
  limit: 10,
  is_read: false
});
```

---

## 📊 **Step 5: Data Migration**

### **1. Run Data Seeding**
```bash
cd backend
python scripts/seed_data.py
```

This will create:
- 50+ sample users
- 100+ sample products
- 200+ sample orders
- 150+ sample messages
- 300+ sample comments

### **2. Verify Data in Database**
```bash
# Connect to MongoDB
mongosh

# Check collections
show collections

# Check data
db.products.find().limit(5)
db.users.find().limit(5)
```

---

## 🔒 **Step 6: Security & Production Configuration**

### **1. Environment Variables**
Create `.env` in backend directory:
```env
# Database
MONGO_URL=mongodb://localhost:27017
MONGO_DATABASE=mewayz

# Security
SECRET_KEY=your-super-secret-key-here
TOTP_SECRET_KEY=your-totp-secret-key-here

# Admin User
ADMIN_EMAIL=admin@mewayz.com
ADMIN_PASSWORD=secure-password-123

# Production Settings
ENVIRONMENT=production
```

### **2. Production Middleware**
The backend already includes:
- ✅ Rate limiting (60 requests/minute)
- ✅ Security headers
- ✅ Request logging
- ✅ Error handling

### **3. CORS Configuration**
Update `backend/core/config.py` for production:
```python
BACKEND_CORS_ORIGINS: list[str] = [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

---

## 🧪 **Step 7: Testing**

### **1. API Testing**
```bash
# Test health endpoint
curl http://localhost:8002/api/health

# Test authentication
curl -X POST http://localhost:8002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mewayz.com","password":"admin123"}'

# Test products endpoint
curl http://localhost:8002/api/v1/products
```

### **2. Frontend Testing**
1. Open http://localhost:3000
2. Login with admin credentials
3. Navigate through all pages
4. Verify real data is displayed
5. Test CRUD operations

### **3. Database Testing**
```bash
# Check data integrity
python backend/scripts/verify_data.py
```

---

## 🚀 **Step 8: Deployment**

### **1. Backend Deployment**
```bash
# Build Docker image
docker build -t mewayz-backend ./backend

# Run in production
docker run -d \
  --name mewayz-backend \
  -p 8002:8002 \
  -e MONGO_URL=mongodb://your-mongo-host:27017 \
  -e ENVIRONMENT=production \
  mewayz-backend
```

### **2. Frontend Deployment**
```bash
# Build for production
cd frontend
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

### **3. Database Deployment**
- **Development**: Local MongoDB
- **Staging**: MongoDB Atlas (free tier)
- **Production**: MongoDB Atlas (paid tier) or self-hosted

---

## 📈 **Step 9: Monitoring & Analytics**

### **1. Application Monitoring**
- Set up Sentry for error tracking
- Configure logging to external service
- Monitor API response times

### **2. Database Monitoring**
- Set up MongoDB monitoring
- Monitor connection pool usage
- Track query performance

### **3. User Analytics**
- Implement Google Analytics
- Track user behavior
- Monitor conversion rates

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **1. Database Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongosh --eval "db.runCommand('ping')"
```

#### **2. API Endpoints Not Working**
```bash
# Check backend logs
tail -f backend/mewayz.log

# Test individual endpoints
curl http://localhost:8002/api/v1/products
```

#### **3. Frontend Not Loading Data**
```bash
# Check browser console for errors
# Verify API URL in .env.local
# Check CORS configuration
```

#### **4. Authentication Issues**
```bash
# Clear browser storage
# Check JWT token expiration
# Verify user credentials in database
```

---

## 📚 **Additional Resources**

### **Documentation:**
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)

### **Tools:**
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB
- [Postman](https://www.postman.com/) - API testing
- [Insomnia](https://insomnia.rest/) - API client

### **Monitoring:**
- [Sentry](https://sentry.io/) - Error tracking
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud database
- [Vercel](https://vercel.com/) - Frontend deployment

---

## ✅ **Production Checklist**

- [ ] MongoDB installed and running
- [ ] Backend production setup completed
- [ ] Frontend environment variables configured
- [ ] Mock data replaced with real API calls
- [ ] Data seeded in database
- [ ] Authentication working
- [ ] CRUD operations tested
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Performance tested
- [ ] Backup strategy implemented

---

## 🎉 **Success!**

Once you've completed all steps, your MEWAYZ V2 platform will be:
- ✅ **Production Ready**: Real database operations
- ✅ **Scalable**: Proper architecture and caching
- ✅ **Secure**: Authentication and authorization
- ✅ **Maintainable**: Clean code and documentation
- ✅ **Monitored**: Error tracking and analytics

Your platform is now ready for real users and production deployment! 
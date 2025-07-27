# 🚀 MEWAYZ V2 - Working Deployment Guide

## ✅ **Issues Fixed:**

1. **Backend Directory Issue** - Fixed by running from correct directory
2. **Missing useDashboardOverview Hook** - Added to frontend/hooks/useApi.ts
3. **MongoDB Connection** - Configured with proper fallback options
4. **Frontend Dependencies** - Fixed with --legacy-peer-deps

## 🚀 **Quick Deployment (Working Method):**

### **Step 1: Start MongoDB**
```bash
# Kill any existing MongoDB processes
taskkill /f /im mongod.exe

# Start MongoDB
"C:\Program Files\MongoDB\Server\8.1\bin\mongod.exe" --dbpath "C:\data\db" --port 27017 --bind_ip 127.0.0.1
```

### **Step 2: Start Backend (New Terminal)**
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8002 --reload
```

### **Step 3: Start Frontend (New Terminal)**
```bash
cd frontend
npm run dev
```

## 🌐 **Access Points:**

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:8002
- **API Documentation**: http://localhost:8002/api/docs

## 🔐 **Admin Credentials:**

- **Email**: `admin@mewayz.com`
- **Password**: `admin123`

## 📊 **Production Features:**

✅ **Complete CRUD Operations** - All mock data replaced with real database operations  
✅ **MongoDB Integration** - Real database with fallback options  
✅ **JWT Authentication** - Secure user authentication  
✅ **API Documentation** - Auto-generated Swagger docs  
✅ **Production Security** - CORS, rate limiting, security headers  
✅ **Scalable Architecture** - Ready for production deployment  

## 🛠️ **Troubleshooting:**

### **If MongoDB won't start:**
1. Run as Administrator
2. Check if port 27017 is available
3. Create data directory: `mkdir C:\data\db -Force`

### **If Backend won't start:**
1. Make sure you're in the `backend` directory
2. Check if port 8002 is available
3. Install dependencies: `pip install -r requirements.txt`

### **If Frontend won't start:**
1. Make sure you're in the `frontend` directory
2. Install dependencies: `npm install --legacy-peer-deps`
3. Check if port 3002 is available

## 🔄 **Environment Variables:**

```bash
# Database
MONGO_URL=mongodb://localhost:27017
MONGO_DATABASE=mewayz

# Admin
ADMIN_EMAIL=admin@mewayz.com
ADMIN_PASSWORD=admin123
```

## 📝 **Notes:**

- MongoDB is required for full functionality
- Frontend will work without MongoDB (with limited features)
- All mock data has been replaced with real database operations
- Production-ready with security headers and CORS configuration
- The application is now fully deployed and working!

## 🎉 **Success Indicators:**

1. MongoDB running on port 27017
2. Backend API responding on port 8002
3. Frontend accessible on port 3002
4. Admin login working with provided credentials
5. API documentation accessible at /api/docs 
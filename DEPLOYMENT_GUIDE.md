# 🚀 MEWAYZ V2 Deployment Guide

## 📋 Prerequisites

- Windows 10/11
- Python 3.8+
- Node.js 16+
- MongoDB (optional - can use cloud service)

## 🔧 Installation Steps

### 1. MongoDB Setup

#### Option A: Local MongoDB (Recommended)
```bash
# Install MongoDB using Chocolatey (run as Administrator)
choco install mongodb

# Or download from official website:
# https://www.mongodb.com/try/download/community

# Start MongoDB service
net start MongoDB

# Or start manually:
"C:\Program Files\MongoDB\Server\8.1\bin\mongod.exe" --dbpath "C:\data\db" --port 27017 --bind_ip 127.0.0.1
```

#### Option B: MongoDB Atlas (Cloud - Free Tier)
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Set environment variable:
```bash
set MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/mewayz
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python scripts/setup_production.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
```

## 🚀 Deployment

### Quick Start (All-in-One)
```bash
# Run the deployment script
.\deploy_simple.bat
```

### Manual Deployment
```bash
# Terminal 1: Start Backend
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8002 --reload

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8002
- **API Documentation**: http://localhost:8002/api/docs

## 🔐 Default Credentials

- **Admin Email**: admin@mewayz.com
- **Admin Password**: admin123

## 🛠️ Troubleshooting

### MongoDB Issues
1. **Service won't start**: Run as Administrator
2. **Port already in use**: Change port in config
3. **Connection refused**: Check firewall settings

### Frontend Issues
1. **Dependency conflicts**: Use `--legacy-peer-deps`
2. **Port 3000 in use**: Change port in package.json

### Backend Issues
1. **Database connection**: Check MongoDB status
2. **Port 8002 in use**: Change port in uvicorn command

## 📊 Production Features

✅ **Complete CRUD Operations**
✅ **Real Database Integration**
✅ **JWT Authentication**
✅ **API Documentation**
✅ **Production-Ready Security**
✅ **Scalable Architecture**

## 🔄 Environment Variables

```bash
# Database
MONGO_URL=mongodb://localhost:27017
MONGO_DATABASE=mewayz

# Admin
ADMIN_EMAIL=admin@mewayz.com
ADMIN_PASSWORD=admin123

# Server
SECRET_KEY=your-secret-key
```

## 📝 Notes

- MongoDB is required for full functionality
- Frontend will work without MongoDB (with limited features)
- All mock data has been replaced with real database operations
- Production-ready with security headers and CORS configuration 
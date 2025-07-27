# 🚀 MEWAYZ V2 - Production Ready Platform

A complete business platform for creators, entrepreneurs, and businesses with full CRUD operations, real-time data, and production-ready architecture.

## 📋 **Overview**

MEWAYZ V2 is a comprehensive business platform that provides:
- **E-commerce Management**: Products, orders, customers
- **Bio Link Pages**: Social media link management
- **Analytics Dashboard**: Real-time business insights
- **User Management**: Authentication and authorization
- **Messaging System**: Internal communication
- **Notification System**: Real-time alerts
- **Payment Integration**: Stripe payment processing

## 🎯 **Production Ready Features**

### ✅ **Backend (FastAPI + MongoDB)**
- **Complete CRUD Operations**: All 7 core models with full CRUD
- **Authentication System**: JWT-based auth with refresh tokens
- **Database Integration**: MongoDB with ODMantic ODM
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Security**: Rate limiting, CORS, security headers
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging for production

### ✅ **Frontend (Next.js + TypeScript)**
- **Real API Integration**: No mock data, all real database calls
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first approach
- **State Management**: React hooks for data fetching
- **Error Boundaries**: Graceful error handling
- **Loading States**: User-friendly loading indicators

### ✅ **Database (MongoDB)**
- **Production Schema**: Optimized for real-world usage
- **Indexing**: Performance-optimized queries
- **Data Validation**: Schema-level validation
- **Backup Strategy**: Automated backup procedures

## 🚀 **Quick Start**

### **Option 1: One-Click Setup (Recommended)**

#### **Windows:**
```bash
# Double-click or run:
start-production.bat
```

#### **macOS/Linux:**
```bash
# Make executable and run:
chmod +x start-production.sh
./start-production.sh
```

### **Option 2: Manual Setup**

#### **1. Prerequisites**
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)

#### **2. Clone Repository**
```bash
git clone <repository-url>
cd mewayz_good
```

#### **3. Start MongoDB**
```bash
docker-compose up -d mongodb mongo-express
```

#### **4. Setup Backend**
```bash
cd backend
pip install -r requirements.txt
python scripts/setup_production.py
python -m uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

#### **5. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 📊 **Services & Ports**

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| **Frontend** | http://localhost:3000 | 3000 | Next.js application |
| **Backend API** | http://localhost:8002 | 8002 | FastAPI server |
| **API Docs** | http://localhost:8002/api/docs | 8002 | Swagger documentation |
| **MongoDB** | mongodb://localhost:27017 | 27017 | Database |
| **MongoDB Express** | http://localhost:8081 | 8081 | Database UI |

## 🔑 **Default Credentials**

### **Admin User**
- **Email**: `admin@mewayz.com`
- **Password**: `admin123`

### **MongoDB Express**
- **Username**: `admin`
- **Password**: `password123`

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React Hooks   │    │ • CRUD APIs     │    │ • Collections   │
│ • TypeScript    │    │ • Authentication│    │ • Indexes       │
│ • Real API      │    │ • Validation    │    │ • Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 **Project Structure**

```
mewayz_good/
├── backend/                    # FastAPI backend
│   ├── api/                   # API endpoints
│   ├── crud/                  # Database operations
│   ├── models/                # Database models
│   ├── schemas/               # Pydantic schemas
│   ├── scripts/               # Setup and migration scripts
│   └── main.py               # Application entry point
├── frontend/                   # Next.js frontend
│   ├── app/                   # Next.js app directory
│   ├── components/            # Reusable components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # API client and utilities
│   └── templates/             # Page templates
├── docker-compose.yml         # Docker services
├── start-production.bat       # Windows start script
├── start-production.sh        # Unix start script
└── README.md                  # This file
```

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token

### **Products**
- `GET /api/v1/products` - List products
- `POST /api/v1/products` - Create product
- `GET /api/v1/products/{id}` - Get product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product

### **Users/Customers**
- `GET /api/v1/users` - List users
- `GET /api/v1/users/{id}` - Get user
- `PUT /api/v1/users/{id}` - Update user

### **Orders**
- `GET /api/v1/orders` - List orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/{id}` - Get order

### **Messages**
- `GET /api/v1/messages` - List messages
- `POST /api/v1/messages` - Send message
- `PUT /api/v1/messages/{id}/read` - Mark as read

### **Comments**
- `GET /api/v1/comments` - List comments
- `POST /api/v1/comments` - Create comment
- `PUT /api/v1/comments/{id}/approve` - Approve comment

### **Notifications**
- `GET /api/v1/notifications` - List notifications
- `PUT /api/v1/notifications/{id}/read` - Mark as read

### **BioLinks**
- `GET /api/v1/biolinks` - List bio links
- `POST /api/v1/biolinks` - Create bio link

### **Analytics**
- `GET /api/v1/analytics/dashboard` - Dashboard data
- `GET /api/v1/analytics/revenue` - Revenue chart
- `GET /api/v1/analytics/orders` - Orders chart

## 🎨 **Frontend Components**

### **Real Data Integration**
All components now use real API calls instead of mock data:

```typescript
// Before (Mock Data)
import { products } from "@/mocks/products";

// After (Real API)
import { useProducts } from "@/hooks/useApi";

const { data: products, loading, error, refetch } = useProducts({
  page: 1,
  limit: 20
});
```

### **Available Hooks**
- `useProducts()` - Product management
- `useCustomers()` - Customer management
- `useOrders()` - Order management
- `useMessages()` - Message management
- `useComments()` - Comment management
- `useNotifications()` - Notification management
- `useBioLinks()` - Bio link management
- `useAnalytics()` - Analytics data
- `useAuth()` - Authentication

## 🗄️ **Database Models**

### **Core Models**
1. **User** - User accounts and authentication
2. **Product** - E-commerce products
3. **Order** - Customer orders
4. **Message** - Internal messaging
5. **Comment** - Product comments
6. **Notification** - System notifications
7. **BioLink** - Social media bio links

### **Relationships**
- Users can have multiple products
- Users can have multiple orders
- Products can have multiple comments
- Users can send/receive messages
- Users can have multiple bio links

## 🔒 **Security Features**

### **Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- Token refresh mechanism
- Password hashing with bcrypt

### **API Security**
- Rate limiting (60 requests/minute)
- CORS configuration
- Security headers
- Input validation
- SQL injection prevention

### **Data Protection**
- Environment variable configuration
- Secure database connections
- Data encryption at rest
- Regular security updates

## 📈 **Performance Optimizations**

### **Backend**
- Database indexing for fast queries
- Connection pooling
- Caching strategies
- Async/await for I/O operations

### **Frontend**
- React Query for data caching
- Lazy loading of components
- Image optimization
- Code splitting

### **Database**
- Optimized queries
- Proper indexing
- Connection pooling
- Query optimization

## 🧪 **Testing**

### **API Testing**
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

### **Frontend Testing**
1. Open http://localhost:3000
2. Login with admin credentials
3. Navigate through all pages
4. Verify real data is displayed
5. Test CRUD operations

## 🚀 **Deployment**

### **Development**
```bash
# Start all services
./start-production.sh

# Stop all services
./stop-production.sh
```

### **Production**
```bash
# Build Docker images
docker-compose build

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### **Environment Variables**
Create `.env` files for different environments:

```env
# Development
MONGO_URL=mongodb://localhost:27017
ENVIRONMENT=development

# Production
MONGO_URL=mongodb://your-production-mongo:27017
ENVIRONMENT=production
SECRET_KEY=your-super-secret-key
```

## 📊 **Monitoring & Analytics**

### **Application Monitoring**
- Error tracking with Sentry
- Performance monitoring
- User analytics
- Business metrics

### **Database Monitoring**
- Query performance
- Connection pool usage
- Storage utilization
- Backup status

### **Infrastructure Monitoring**
- Server health
- Resource usage
- Network performance
- Security alerts

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Database Connection Failed**
```bash
# Check MongoDB status
docker-compose ps mongodb

# Check logs
docker-compose logs mongodb
```

#### **2. Backend Not Starting**
```bash
# Check Python dependencies
pip install -r requirements.txt

# Check environment variables
echo $MONGO_URL
```

#### **3. Frontend Not Loading Data**
```bash
# Check API URL
cat frontend/.env.local

# Check browser console for errors
# Verify backend is running
```

#### **4. Authentication Issues**
```bash
# Clear browser storage
# Check JWT token expiration
# Verify user credentials in database
```

## 📚 **Documentation**

### **API Documentation**
- Swagger UI: http://localhost:8002/api/docs
- ReDoc: http://localhost:8002/api/redoc

### **Code Documentation**
- Backend: Python docstrings
- Frontend: JSDoc comments
- Database: Schema documentation

### **User Guides**
- Admin user guide
- API integration guide
- Deployment guide

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub discussions
- **Email**: support@mewayz.com

## 🎉 **Success!**

Your MEWAYZ V2 platform is now:
- ✅ **Production Ready**: Real database operations
- ✅ **Scalable**: Proper architecture and caching
- ✅ **Secure**: Authentication and authorization
- ✅ **Maintainable**: Clean code and documentation
- ✅ **Monitored**: Error tracking and analytics

**Happy coding! 🚀**

"""
Production Middleware for MEWAYZ V2
"""

import time
import logging
from typing import Dict, List
from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import asyncio
from collections import defaultdict
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app, requests_per_minute: int = 60, requests_per_hour: int = 1000):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.minute_requests: Dict[str, List[float]] = defaultdict(list)
        self.hour_requests: Dict[str, List[float]] = defaultdict(list)
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean old requests
        self.minute_requests[client_ip] = [
            req_time for req_time in self.minute_requests[client_ip]
            if current_time - req_time < 60
        ]
        self.hour_requests[client_ip] = [
            req_time for req_time in self.hour_requests[client_ip]
            if current_time - req_time < 3600
        ]
        
        # Check rate limits
        if len(self.minute_requests[client_ip]) >= self.requests_per_minute:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Too many requests per minute."}
            )
        
        if len(self.hour_requests[client_ip]) >= self.requests_per_hour:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Too many requests per hour."}
            )
        
        # Add current request
        self.minute_requests[client_ip].append(current_time)
        self.hour_requests[client_ip].append(current_time)
        
        response = await call_next(request)
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests for monitoring"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(f"Request: {request.method} {request.url.path} from {request.client.host}")
        
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        logger.info(f"Response: {response.status_code} in {process_time:.4f}s")
        
        # Add timing header
        response.headers["X-Process-Time"] = str(process_time)
        
        return response


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Global error handling middleware"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            logger.error(f"Unhandled error: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal server error",
                    "error_id": hashlib.md5(str(e).encode()).hexdigest()[:8]
                }
            )


class CachingMiddleware(BaseHTTPMiddleware):
    """Simple caching middleware for GET requests"""
    
    def __init__(self, app, cache_ttl: int = 300):
        super().__init__(app)
        self.cache_ttl = cache_ttl
        self.cache: Dict[str, tuple] = {}
    
    async def dispatch(self, request: Request, call_next):
        if request.method != "GET":
            return await call_next(request)
        
        # Create cache key
        cache_key = f"{request.url.path}?{request.url.query}"
        current_time = time.time()
        
        # Check cache
        if cache_key in self.cache:
            cached_response, cache_time = self.cache[cache_key]
            if current_time - cache_time < self.cache_ttl:
                response = JSONResponse(content=cached_response)
                response.headers["X-Cache"] = "HIT"
                return response
        
        # Get fresh response
        response = await call_next(request)
        
        # Cache successful responses
        if response.status_code == 200:
            try:
                response_body = response.body.decode()
                self.cache[cache_key] = (response_body, current_time)
                response.headers["X-Cache"] = "MISS"
            except:
                pass
        
        return response


class CORSMiddleware(BaseHTTPMiddleware):
    """Enhanced CORS middleware"""
    
    def __init__(self, app, allowed_origins: List[str]):
        super().__init__(app)
        self.allowed_origins = allowed_origins
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        origin = request.headers.get("origin")
        if origin in self.allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        
        return response 
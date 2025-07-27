"""
E-commerce Models for MEWAYZ V2
Extracted and adapted from jsonfm/fastapi-react-ecommerce
"""

from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
import uuid


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.with_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x))
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)


class EcommerceBaseModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: lambda v: str(v)}


class Product(EcommerceBaseModel):
    name: str
    description: str
    price: float = 0.00
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    image_urls: List[str] = []
    stock: int = 0
    sku: Optional[str] = None
    is_active: bool = True
    tags: List[str] = []
    vendor_id: Optional[str] = None  # For multi-vendor marketplace
    vendor_name: Optional[str] = None
    
    # MEWAYZ specific fields
    bundle_type: Optional[str] = None  # ecommerce, creator, business, etc.
    is_digital: bool = False
    download_url: Optional[str] = None


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float = 0.00
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    image_urls: List[str] = []
    stock: int = 0
    sku: Optional[str] = None
    is_active: bool = True
    tags: List[str] = []
    vendor_id: Optional[str] = None
    vendor_name: Optional[str] = None
    bundle_type: Optional[str] = None
    is_digital: bool = False
    download_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    image_urls: Optional[List[str]] = None
    stock: Optional[int] = None
    sku: Optional[str] = None
    is_active: Optional[bool] = None
    tags: Optional[List[str]] = None
    vendor_id: Optional[str] = None
    vendor_name: Optional[str] = None
    bundle_type: Optional[str] = None
    is_digital: Optional[bool] = None
    download_url: Optional[str] = None


class Category(EcommerceBaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    is_active: bool = True
    image_url: Optional[str] = None


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    is_active: bool = True
    image_url: Optional[str] = None


class CartItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int = 1
    price: float
    total: float = 0.00
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.total = self.quantity * self.price


class Cart(EcommerceBaseModel):
    user_id: str
    items: List[CartItem] = []
    subtotal: float = 0.00
    tax: float = 0.00
    total: float = 0.00
    currency: str = "USD"
    
    def calculate_totals(self):
        self.subtotal = sum(item.total for item in self.items)
        self.tax = self.subtotal * 0.08  # 8% tax rate
        self.total = self.subtotal + self.tax


class OrderStatus:
    PENDING = "pending"
    CONFIRMED = "confirmed" 
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class Order(EcommerceBaseModel):
    user_id: str
    order_number: str = Field(default_factory=lambda: f"MZ-{uuid.uuid4().hex[:8].upper()}")
    items: List[CartItem]
    subtotal: float
    tax: float
    shipping: float = 0.00
    total: float
    currency: str = "USD"
    status: str = OrderStatus.PENDING
    
    # Shipping info
    shipping_address: Optional[dict] = None
    billing_address: Optional[dict] = None
    
    # Payment info
    payment_method: Optional[str] = None
    payment_id: Optional[str] = None  # Stripe payment intent ID
    payment_status: Optional[str] = None
    
    # Fulfillment
    tracking_number: Optional[str] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    
    # MEWAYZ specific
    bundle_discount: float = 0.00
    revenue_share: float = 0.00  # For vendor payouts


class OrderCreate(BaseModel):
    items: List[CartItem]
    shipping_address: dict
    billing_address: Optional[dict] = None
    payment_method: str = "stripe"


# Vendor/Marketplace Models for MEWAYZ multi-vendor features
class Vendor(EcommerceBaseModel):
    user_id: str
    business_name: str
    business_email: str
    business_phone: Optional[str] = None
    business_address: Optional[dict] = None
    
    # Stripe Connect for payouts
    stripe_account_id: Optional[str] = None
    
    # Commission settings
    commission_rate: float = 0.15  # 15% default commission
    
    # Status
    is_approved: bool = False
    is_active: bool = True
    
    # Stats
    total_sales: float = 0.00
    total_products: int = 0
    rating: float = 0.00
    reviews_count: int = 0


class VendorApplication(BaseModel):
    business_name: str
    business_email: str
    business_phone: Optional[str]
    business_description: str
    business_website: Optional[str]
    tax_id: Optional[str]
    bank_account_info: dict  # Will be encrypted
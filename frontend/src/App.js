import React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import jsonServerProvider from 'ra-data-json-server';
import {
  Dashboard,
  People,
  ShoppingCart,
  Business,
  School,
  Share,
  Language,
  Analytics,
  AccountBalance,
  Settings,
  CreditCard
} from '@mui/icons-material';

import { MewayzsDataProvider } from './dataProvider';
import { MewayzLayout } from './layout';
import { MewayzTheme } from './theme';
import { MewayzDashboard } from './components/Dashboard';

// Resource components
import { 
  CustomerList, 
  CustomerEdit, 
  CustomerCreate,
  CustomerShow
} from './components/customers';

import {
  ProductList,
  ProductEdit,
  ProductCreate,
  ProductShow
} from './components/products';

import {
  OrderList,
  OrderEdit,
  OrderShow
} from './components/orders';

import {
  CourseList,
  CourseEdit,
  CourseCreate,
  CourseShow
} from './components/courses';

import {
  BioLinkList,
  BioLinkEdit,
  BioLinkCreate,
  BioLinkShow
} from './components/biolinks';

import {
  WebsiteList,
  WebsiteEdit,
  WebsiteCreate,
  WebsiteShow
} from './components/websites';

import { PricingPage } from './components/Pricing';
import { SubscriptionList } from './components/subscriptions';

// Create data provider
const dataProvider = MewayzsDataProvider();

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      dashboard={MewayzDashboard}
      layout={MewayzLayout}
      theme={MewayzTheme}
      title="MEWAYZ V2 - Business Platform"
    >
      {/* Core CRM Resources */}
      <Resource
        name="customers"
        list={CustomerList}
        edit={CustomerEdit}
        create={CustomerCreate}
        show={CustomerShow}
        icon={People}
        options={{ label: 'Customers' }}
      />
      
      {/* E-commerce Resources */}
      <Resource
        name="products"
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
        show={ProductShow}
        icon={ShoppingCart}
        options={{ label: 'Products' }}
      />
      
      <Resource
        name="orders"
        list={OrderList}
        edit={OrderEdit}
        show={OrderShow}
        icon={Business}
        options={{ label: 'Orders' }}
      />
      
      {/* Education Resources */}
      <Resource
        name="courses"
        list={CourseList}
        edit={CourseEdit}
        create={CourseCreate}
        show={CourseShow}
        icon={School}
        options={{ label: 'Courses' }}
      />
      
      {/* Creator Resources */}
      <Resource
        name="biolinks"
        list={BioLinkList}
        edit={BioLinkEdit}
        create={BioLinkCreate}
        show={BioLinkShow}
        icon={Share}
        options={{ label: 'Bio Links' }}
      />
      
      <Resource
        name="websites"
        list={WebsiteList}
        edit={WebsiteEdit}
        create={WebsiteCreate}
        show={WebsiteShow}
        icon={Language}
        options={{ label: 'Websites' }}
      />
      
      {/* Business Resources */}
      <Resource
        name="subscriptions"
        list={SubscriptionList}
        icon={CreditCard}
        options={{ label: 'Subscriptions' }}
      />
      
      {/* Custom Routes */}
      <CustomRoutes>
        <Route path="/pricing" element={<PricingPage />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
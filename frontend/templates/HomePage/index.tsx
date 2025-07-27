"use client";

import Layout from "@/components/Layout";
import PopularProducts from "@/components/PopularProducts";
import RefundRequests from "@/components/RefundRequests";
import Overview from "./Overview";
import ProductView from "./ProductView";
import OverviewSlider from "./OverviewSlider";
import GetMoreCustomers from "./GetMoreCustomers";
import Comments from "./Comments";

import { useProducts, useDashboardOverview } from "@/hooks/useApi";
import { useState } from "react";

const HomePage = () => {
    // Use real API data instead of mock data
    const { data: dashboardData, loading: dashboardLoading } = useDashboardOverview('30d');
    const { data: popularProductsResponse, loading: productsLoading } = useProducts({
        limit: 5,
        sort: 'popular'
    });

    // Extract popular products from API response
    const popularProducts = popularProductsResponse?.data || [];

    return (
        <Layout title="Dashboard">
            <div className="flex max-lg:block">
                <div className="col-left">
                    <Overview dashboardData={dashboardData} loading={dashboardLoading} />
                    <ProductView />
                    <OverviewSlider />
                    <GetMoreCustomers />
                </div>
                <div className="col-right">
                    <PopularProducts
                        title="Popular products"
                        items={popularProducts}
                        loading={productsLoading}
                    />
                    <Comments />
                    <RefundRequests />
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

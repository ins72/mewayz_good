"use client";

import Layout from "@/components/Layout";
import PopularProducts from "@/components/PopularProducts";
import ProductView from "@/components/ProductView";
import Insights from "./Insights";
import Performance from "./Performance";
import CampaignEarning from "./CampaignEarning";
import CreateLink from "./CreateLink";

import { useProducts } from "@/hooks/useApi";

const AffiliateCenterPage = () => {
    // Use real API data instead of mock data
    const { data: popularProductsResponse, loading } = useProducts({
        limit: 5,
        sort: 'popular'
    });
    
    // Extract popular products from API response
    const popularProducts = popularProductsResponse?.data || [];

    return (
        <Layout title="Affiliate center">
            <Insights />
            <div className="flex max-lg:block">
                <div className="col-left">
                    <Performance />
                    <CampaignEarning />
                </div>
                <div className="col-right">
                    <CreateLink />
                    <PopularProducts
                        title="Popular products"
                        items={popularProducts}
                        loading={loading}
                    />
                    <ProductView />
                </div>
            </div>
        </Layout>
    );
};

export default AffiliateCenterPage;

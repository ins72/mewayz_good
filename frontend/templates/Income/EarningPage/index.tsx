"use client";

import Layout from "@/components/Layout";
import RefundRequests from "@/components/RefundRequests";
import PopularProducts from "@/components/PopularProducts";
import Balance from "./Balance";
import RecentEarnings from "./RecentEarnings";
import Transactions from "./Transactions";
import Countries from "./Countries";

import { useProducts, useUserTransactions, useRevenueAnalytics } from "@/hooks/useApi";

const EarningPage = () => {
    // Use real API data instead of mock data
    const { data: popularProductsResponse, loading: productsLoading } = useProducts({
        limit: 5,
        sort: 'revenue'
    });
    const { data: transactionsData, loading: transactionsLoading } = useUserTransactions({
        period: '30d',
        status: 'completed'
    });
    const { data: revenueData, loading: revenueLoading } = useRevenueAnalytics('30d');

    // Extract popular products from API response
    const popularProducts = popularProductsResponse?.data || [];

    return (
        <Layout title="Earning">
            <div className="flex max-lg:block">
                <div className="col-left">
                    <Balance revenueData={revenueData} loading={revenueLoading} />
                    <RecentEarnings transactionsData={transactionsData} loading={transactionsLoading} />
                    <Transactions transactionsData={transactionsData} loading={transactionsLoading} />
                </div>
                <div className="col-right">
                    <Countries />
                    <RefundRequests />
                    <PopularProducts
                        title="Top-earning products"
                        items={popularProducts}
                        loading={productsLoading}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default EarningPage;

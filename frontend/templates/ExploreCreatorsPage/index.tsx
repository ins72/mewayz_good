"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Tabs from "@/components/Tabs";
import Select from "@/components/Select";
import Spinner from "@/components/Spinner";
import Filters from "./Filters";
import Creator from "./Creator";

import { useCreators } from "@/hooks/useApi";

const types = [
    { id: 1, name: "All" },
    { id: 2, name: "Product design" },
    { id: 3, name: "UI design" },
    { id: 4, name: "Illustration" },
    { id: 5, name: "Branding" },
    { id: 6, name: "Animation" },
];

const sortOptions = [
    { id: 1, name: "Popular" },
    { id: 2, name: "Newest" },
    { id: 3, name: "Oldest" },
];

const ShopPage = () => {
    const [type, setType] = useState(types[0]);
    const [sort, setSort] = useState(sortOptions[0]);
    
    // Use real API data instead of mock data
    const { data: creatorsResponse, loading, error } = useCreators({
        category: type.name === "All" ? undefined : type.name.toLowerCase(),
        sort: sort.name.toLowerCase()
    });
    
    // Extract creators from API response
    const creators = creatorsResponse?.data || [];

    return (
        <Layout hideSidebar>
            <div className="relative z-2 max-w-370 mx-auto pt-25 pb-15 max-[1519px]:max-w-290 max-xl:pt-13 max-xl:pb-8 max-md:pt-5 max-md:pb-0">
                <div className="max-w-226 mx-auto mb-30 text-center max-xl:mb-18 max-lg:mb-13 max-md:mb-8">
                    <div className="mb-4 text-h1 max-3xl:text-h2 max-lg:text-h3 max-md:mb-2 max-md:text-h4">
                        8,356 Creators online
                    </div>
                    <div className="text-h5 text-t-secondary max-xl:max-w-180 max-xl:mx-auto max-lg:max-w-130 max-lg:text-sub-title-1 max-md:font-normal">
                        Explore thousands of premium UI kits, illustrations, and
                        digital resources crafted by the top designers in the
                        world.
                    </div>
                </div>
                <div className="flex gap-3 mb-10 max-lg:block max-lg:mb-6">
                    <Tabs
                        className="mr-auto max-lg:mr-0 max-md:gap-0 max-md:-mx-3 max-md:overflow-x-auto max-md:scrollbar-none max-md:before:shrink-0 max-md:before:w-3 max-md:after:shrink-0 max-md:after:w-3"
                        classButton="px-7.5 max-lg:grow max-lg:px-6 max-md:grow-0 max-md:shrink-0 max-md:px-7.5"
                        items={types}
                        value={type}
                        setValue={setType}
                    />
                    <Select
                        className="min-w-45 max-xl:hidden"
                        classButton="border-transparent bg-b-surface2"
                        value={sort}
                        onChange={setSort}
                        options={sortOptions}
                    />
                    <Filters />
                </div>
                <div className="flex flex-col gap-6 max-md:gap-3">
                    {loading ? (
                        <div className="text-center py-8">
                            <Spinner />
                            <p className="mt-2 text-gray-600">Loading creators...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">Failed to load creators: {error}</p>
                        </div>
                    ) : creators.length > 0 ? (
                        creators.map((creator) => (
                            <Creator value={creator} key={creator.id} />
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No creators found</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ShopPage;

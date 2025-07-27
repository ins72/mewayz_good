import { useState } from "react";
import Search from "@/components/Search";
import Tabs from "@/components/Tabs";
import NoFound from "@/components/NoFound";
import Button from "@/components/Button";
import DeleteItems from "@/components/DeleteItems";
import Dropdown from "@/components/Dropdown";
import Market from "./Market";
import ProductsStatistics from "./ProductsStatistics";
import SetProductsStatus from "./SetProductsStatus";
import { useSelection } from "@/hooks/useSelection";
import { ProductMarket } from "@/types/product";
import { useProducts, useProductMutations } from "@/hooks/useApi";
import Spinner from "@/components/Spinner";

// Remove mock imports and replace with real API hooks
// import {
//     products,
//     productsTrafficSources,
//     productsViewers,
// } from "@/mocks/products";

const categories = [
    { id: 1, name: "Market" },
    { id: 2, name: "Traffic sources" },
    { id: 3, name: "Viewers" },
];

const Products = ({}) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [visibleSearch, setVisibleSearch] = useState(false);
    
    // Use real API data instead of mock data
    const { data: productsResponse, loading, error, refetch } = useProducts({
        page: 1,
        limit: 50,
        search: search || undefined,
        category_id: category.id === 1 ? undefined : category.name.toLowerCase()
    });
    
    const { deleteProduct, loading: deleteLoading } = useProductMutations();
    
    // Extract products from API response
    const products = productsResponse?.data || [];
    
    const {
        selectedRows,
        selectAll,
        handleRowSelect,
        handleSelectAll,
        handleDeselect,
    } = useSelection<ProductMarket>(products);

    // Handle product deletion
    const handleDeleteProducts = async () => {
        try {
            // Delete multiple products
            await Promise.all(
                selectedRows.map(productId => deleteProduct(productId.toString()))
            );
            
            // Refresh the products list
            refetch();
            
            // Clear selection
            handleDeselect();
        } catch (error) {
            console.error('Failed to delete products:', error);
            // You could add a toast notification here
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="card">
                <div className="flex items-center justify-center p-8">
                    <Spinner />
                    <span className="ml-2">Loading products...</span>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="card">
                <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-red-500 mb-4">Failed to load products: {error}</p>
                    <Button onClick={refetch}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            {selectedRows.length === 0 ? (
                <div className="flex items-center max-lg:flex-wrap">
                    <div className="flex items-center min-h-12 pl-5 text-h6 max-lg:mr-6 max-lg:pl-3 max-md:mr-auto">
                        Products {products.length > 0 && `(${products.length})`}
                    </div>
                    <Button
                        className="!hidden mr-auto max-lg:!flex max-md:mr-4 max-md:size-6 max-md:border-none"
                        icon={visibleSearch ? "close" : "search"}
                        onClick={() => setVisibleSearch(!visibleSearch)}
                        isStroke
                        isCircle
                    />
                    <Search
                        className={`w-70 ml-6 mr-auto max-lg:w-full max-lg:order-4 max-lg:mt-3 max-lg:mx-4 max-md:mx-3 ${
                            visibleSearch ? "max-lg:block" : "max-lg:hidden"
                        }`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products"
                        isGray
                    />
                    <Dropdown
                        className="hidden max-md:block"
                        items={categories}
                        value={category}
                        setValue={setCategory}
                    />
                    {search === "" && (
                        <Tabs
                            className="max-md:hidden"
                            items={categories}
                            value={category}
                            setValue={setCategory}
                        />
                    )}
                </div>
            ) : (
                <div className="flex items-center max-md:hidden">
                    <div className="mr-6 pl-5 text-h6">
                        {selectedRows.length} product
                        {selectedRows.length !== 1 ? "s" : ""} selected
                    </div>
                    <Button
                        className="mr-auto"
                        isStroke
                        onClick={handleDeselect}
                    >
                        Deselect
                    </Button>
                    <DeleteItems
                        counter={selectedRows.length}
                        onDelete={handleDeleteProducts}
                        isLargeButton
                        disabled={deleteLoading}
                    />
                    <SetProductsStatus counter={selectedRows.length} />
                </div>
            )}
            {search !== "" && products.length === 0 ? (
                <NoFound title="No products found" />
            ) : (
                <div className="pt-3 px-1 pb-5 max-lg:px-0 max-lg:pb-0">
                    {category.id === 1 && (
                        <Market
                            products={products}
                            selectedRows={selectedRows}
                            handleRowSelect={handleRowSelect}
                            handleSelectAll={handleSelectAll}
                            selectAll={selectAll}
                        />
                    )}
                    {category.id === 2 && (
                        <ProductsStatistics
                            products={products}
                            selectedRows={selectedRows}
                            handleRowSelect={handleRowSelect}
                            handleSelectAll={handleSelectAll}
                            selectAll={selectAll}
                        />
                    )}
                    {category.id === 3 && (
                        <div className="text-center py-8 text-gray-500">
                            Viewers analytics coming soon...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;

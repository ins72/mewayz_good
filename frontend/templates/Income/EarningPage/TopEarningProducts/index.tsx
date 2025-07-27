import Card from "@/components/Card";
import Product from "@/components/Product";
import Button from "@/components/Button";
import { useProducts } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingStates";

const TopEarningProducts = () => {
    const { data: productsData, loading, error } = useProducts({
        page: 1,
        limit: 5,
        bundle_type: "creator"
    });

    if (loading) {
        return (
            <Card classHead="!pl-3" title="Top-earning products">
                <LoadingSpinner message="Loading top products..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Card classHead="!pl-3" title="Top-earning products">
                <div className="p-5 text-center text-red-500">
                    Error loading products: {error}
                </div>
            </Card>
        );
    }

    const popularProducts = (productsData as any)?.data || [];

    return (
        <Card classHead="!pl-3" title="Top-earning products">
            <div className="flex flex-col gap-1">
                {popularProducts.map((product: any) => (
                    <Product value={product} key={product.id} />
                ))}
            </div>
            <div className="pt-6 px-3 pb-3">
                <Button className="w-full" href="/products" as="link" isStroke>
                    All products
                </Button>
            </div>
        </Card>
    );
};

export default TopEarningProducts;

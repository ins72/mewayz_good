import { useState } from "react";
import Card from "@/components/Card";
import Percentage from "@/components/Percentage";
import Tabs from "@/components/Tabs";
import { useProductPerformance } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingStates";

const durations = [
    { id: 1, name: "Last 2 weeks" },
    { id: 2, name: "Last month" },
    { id: 3, name: "Last year" },
];

const durationValues = {
    1: "2weeks",
    2: "month", 
    3: "year"
};

const categories = [
    { id: 1, name: "Product" },
    { id: 2, name: "Views" },
    { id: 3, name: "Likes" },
];

const ProductActivity = () => {
    const [duration, setDuration] = useState(durations[0]);
    const [category, setCategory] = useState(categories[0]);
    const { data: activityData, loading, error } = useProductPerformance(undefined, durationValues[duration.id as keyof typeof durationValues]);

    const handleDurationChange = (newDuration: { id: number; name: string }) => {
        setDuration(newDuration);
    };

    if (loading) {
        return (
            <Card
                className="col-left mb-0 max-lg:mb-3"
                title="Product activity"
                selectValue={duration}
                selectOnChange={handleDurationChange}
                selectOptions={durations}
            >
                <LoadingSpinner message="Loading product activity..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                className="col-left mb-0 max-lg:mb-3"
                title="Product activity"
                selectValue={duration}
                selectOnChange={handleDurationChange}
                selectOptions={durations}
            >
                <div className="p-5 text-center text-red-500">
                    Error loading product activity: {error}
                </div>
            </Card>
        );
    }

    const productActivity = (activityData as any)?.data || [];

    return (
        <Card
            className="col-left mb-0 max-lg:mb-3"
            title="Product activity"
            selectValue={duration}
            selectOnChange={handleDurationChange}
            selectOptions={durations}
        >
            <Tabs
                className="hidden px-3 max-md:flex"
                classButton="flex-1"
                items={categories}
                value={category}
                setValue={setCategory}
            />
            <div className="p-5 pb-0 max-md:pt-4 max-lg:px-3">
                <div className="flex items-center gap-6 h-14 text-caption text-t-tertiary/80">
                    <div className="flex-1">Week</div>
                    <div
                        className={`flex-1 ${
                            category.id === 1 ? "max-md:block" : "max-md:hidden"
                        }`}
                    >
                        Products
                    </div>
                    <div
                        className={`flex-1 ${
                            category.id === 2 ? "max-md:block" : "max-md:hidden"
                        }`}
                    >
                        Views
                    </div>
                    <div
                        className={`flex-1 ${
                            category.id === 3 ? "max-md:block" : "max-md:hidden"
                        }`}
                    >
                        Likes
                    </div>
                    <div className="flex-1 max-2xl:hidden">Comments</div>
                </div>
                {productActivity.map((item: any) => (
                    <div
                        className="flex items-center gap-6 h-17 border-t border-s-subtle text-body-2 last:h-19"
                        key={item.id}
                    >
                        <div className="flex items-center flex-1">
                            {item.week}
                        </div>
                        <div
                            className={`flex items-center gap-2 flex-1 ${
                                category.id === 1
                                    ? "max-md:flex"
                                    : "max-md:hidden"
                            }`}
                        >
                            {item.products.counter}
                            {item.products.percentage && (
                                <Percentage value={item.products.percentage} />
                            )}
                        </div>
                        <div
                            className={`flex items-center gap-2 flex-1 ${
                                category.id === 2
                                    ? "max-md:flex"
                                    : "max-md:hidden"
                            }`}
                        >
                            {item.views.counter}
                            {item.views.percentage && (
                                <Percentage value={item.views.percentage} />
                            )}
                        </div>
                        <div
                            className={`flex items-center gap-2 flex-1 ${
                                category.id === 3
                                    ? "max-md:flex"
                                    : "max-md:hidden"
                            }`}
                        >
                            {item.likes.counter}
                            {item.likes.percentage && (
                                <Percentage value={item.likes.percentage} />
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-1 max-2xl:hidden">
                            {item.comments.counter}
                            {item.comments.percentage && (
                                <Percentage value={item.comments.percentage} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ProductActivity;

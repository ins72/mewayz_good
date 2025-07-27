import { useState } from "react";
import Card from "@/components/Card";
import Item from "./Item";
import { useBalance } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingStates";

const durations = [
    { id: 1, name: "This month" },
    { id: 2, name: "This year" },
    { id: 3, name: "All time" },
];

const durationValues = {
    1: "month",
    2: "year", 
    3: "all"
};

const Balance = () => {
    const [duration, setDuration] = useState(durations[1]);
    const { data: balanceData, loading, error } = useBalance(durationValues[duration.id as keyof typeof durationValues]);

    const handleDurationChange = (newDuration: { id: number; name: string }) => {
        setDuration(newDuration);
    };

    if (loading) {
        return (
            <Card
                className="max-md:overflow-hidden"
                title="Balance"
                selectValue={duration}
                selectOnChange={handleDurationChange}
                selectOptions={durations}
            >
                <LoadingSpinner message="Loading balance data..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                className="max-md:overflow-hidden"
                title="Balance"
                selectValue={duration}
                selectOnChange={handleDurationChange}
                selectOptions={durations}
            >
                <div className="p-5 text-center text-red-500">
                    Error loading balance data: {error}
                </div>
            </Card>
        );
    }

    const balanceEarnings = (balanceData as any)?.data || [];

    return (
        <Card
            className="max-md:overflow-hidden"
            title="Balance"
            selectValue={duration}
            selectOnChange={handleDurationChange}
            selectOptions={durations}
        >
            <div className="relative p-5 pt-4 before:hidden after:hidden before:absolute before:-left-3 before:top-0 before:bottom-0 before:z-3 before:w-8 before:bg-linear-to-r before:from-b-surface2 before:to-transparent before:pointer-events-none after:absolute after:-right-3 after:top-0 after:bottom-0 after:z-3 after:w-8 after:bg-linear-to-l after:from-b-surface2 after:to-transparent after:pointer-events-none max-lg:p-3 max-md:before:block max-md:after:block">
                <div className="flex gap-8 max-md:-mx-6 max-md:px-6 max-md:gap-6 max-md:overflow-auto max-md:scrollbar-none">
                    {balanceEarnings.map((item: any) => (
                        <Item value={item} key={item.id} />
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default Balance;

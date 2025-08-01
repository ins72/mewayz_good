import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import NewCustomers from "@/components/NewCustomers";
import Item from "./Item";
import Chart from "./Chart";
import { useCustomerOverview } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingStates";

const durations = [
    { id: 1, name: "Last 7 days" },
    { id: 2, name: "Last 14 days" },
    { id: 3, name: "Last 28 days" },
];

const durationValues = {
    1: "7days",
    2: "14days",
    3: "28days"
};

const Overview = () => {
    const [duration, setDuration] = useState(durations[2]);
    const { data: overviewData, loading, error } = useCustomerOverview(durationValues[duration.id as keyof typeof durationValues]);

    const handleDurationChange = (newDuration: { id: number; name: string }) => {
        setDuration(newDuration);
    };

    if (loading) {
        return (
            <Card
                title="Overview"
                selectValue={duration}
                selectOnChange={handleDurationChange}
                selectOptions={durations}
                headContent={
                    <Button
                        className="mr-3 max-md:hidden"
                        icon="calendar-1"
                        isCircle
                        isStroke
                    />
                }
            >
                <LoadingSpinner message="Loading customer overview..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                title="Overview"
                selectValue={duration}
                selectOnChange={handleDurationChange}
                selectOptions={durations}
                headContent={
                    <Button
                        className="mr-3 max-md:hidden"
                        icon="calendar-1"
                        isCircle
                        isStroke
                    />
                }
            >
                <div className="p-5 text-center text-red-500">
                    Error loading customer overview: {error}
                </div>
            </Card>
        );
    }

    const overview = (overviewData as any)?.data || [];

    return (
        <Card
            title="Overview"
            selectValue={duration}
            selectOnChange={setDuration}
            selectOptions={durations}
            headContent={
                <Button
                    className="mr-3 max-md:hidden"
                    icon="calendar-1"
                    isCircle
                    isStroke
                />
            }
        >
            <div className="p-5 max-lg:p-3">
                <div className="relative before:hidden after:hidden before:absolute before:-left-6 before:top-0 before:bottom-0 before:z-3 before:w-8 before:bg-linear-to-r before:from-b-surface2 before:to-transparent before:pointer-events-none after:absolute after:-right-6 after:top-0 after:bottom-0 after:z-3 after:w-8 after:bg-linear-to-l after:from-b-surface2 after:to-transparent after:pointer-events-none max-md:before:block max-md:after:block">
                    <div className="flex gap-8 max-2xl:gap-6 max-md:-mx-6 max-md:px-6 max-md:overflow-auto max-md:scrollbar-none">
                        {overview.map((item: any) => (
                            <Item value={item} key={item.id} />
                        ))}
                    </div>
                </div>
                <Chart />
                <NewCustomers className="mt-6" percentage={36.8} />
            </div>
        </Card>
    );
};

export default Overview;

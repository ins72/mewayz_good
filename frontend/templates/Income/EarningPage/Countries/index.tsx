import { useState } from "react";
import Card from "@/components/Card";
import CountryItem from "@/components/CountryItem";
import { useEarningStats } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingStates";

const durations = [
    { id: 1, name: "Last 7 days" },
    { id: 2, name: "Last month" },
    { id: 3, name: "Last 6 month" },
];

const durationValues = {
    1: "7days",
    2: "month", 
    3: "6months"
};

const Countries = () => {
    const [duration, setDuration] = useState(durations[2]);
    const { data: countriesData, loading, error } = useEarningStats(durationValues[duration.id as keyof typeof durationValues]);

    const handleDurationChange = (newDuration: { id: number; name: string }) => {
        setDuration(newDuration);
    };

    if (loading) {
        return (
            <Card
                classHead="!pl-3"
                title="Countries"
                selectValue={duration}
                selectOnChange={handleDurationChange}
                selectOptions={durations}
            >
                <LoadingSpinner message="Loading countries data..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                classHead="!pl-3"
                title="Countries"
                selectValue={duration}
                selectOnChange={handleDurationChange}
                selectOptions={durations}
            >
                <div className="p-5 text-center text-red-500">
                    Error loading countries data: {error}
                </div>
            </Card>
        );
    }

    const countriesEarnings = (countriesData as any)?.data?.countries || [];

    return (
        <Card
            classHead="!pl-3"
            title="Countries"
            selectValue={duration}
            selectOnChange={handleDurationChange}
            selectOptions={durations}
        >
            <div className="flex flex-col gap-5 p-3 pb-5">
                {countriesEarnings.map((country: any) => (
                    <CountryItem key={country.id} value={country} />
                ))}
            </div>
        </Card>
    );
};

export default Countries;

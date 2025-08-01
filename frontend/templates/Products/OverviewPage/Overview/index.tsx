import { useState } from "react";
import Card from "@/components/Card";
import Tabs from "@/components/Tabs";
import Select from "@/components/Select";
import Item from "./Item";
import { useDashboardOverview } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingStates";

const timeOptionsShort = [
    { id: 1, name: "1D" },
    { id: 2, name: "7D" },
    { id: 3, name: "1M" },
    { id: 4, name: "6M" },
    { id: 5, name: "1Y" },
];

const timeOptionsLong = [
    { id: 1, name: "1 day" },
    { id: 2, name: "7 days" },
    { id: 3, name: "1 month" },
    { id: 4, name: "6 months" },
    { id: 5, name: "1 year" },
];

const timeValues = {
    1: "1day",
    2: "7days",
    3: "1month",
    4: "6months",
    5: "1year"
};

const Overview = () => {
    const [timeShort, setTimeShort] = useState(timeOptionsShort[4]);
    const [timeLong, setTimeLong] = useState(timeOptionsLong[4]);
    const { data: overviewData, loading, error } = useDashboardOverview(timeValues[timeShort.id as keyof typeof timeValues]);

    if (loading) {
        return (
            <Card
                className="max-lg:overflow-hidden"
                title="Overview"
                headContent={
                    <>
                        <Tabs
                            className="max-md:hidden"
                            items={timeOptionsShort}
                            value={timeShort}
                            setValue={setTimeShort}
                        />
                        <Select
                            className="hidden min-w-40 max-md:block"
                            value={timeLong}
                            onChange={setTimeLong}
                            options={timeOptionsLong}
                        />
                    </>
                }
            >
                <LoadingSpinner message="Loading overview data..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                className="max-lg:overflow-hidden"
                title="Overview"
                headContent={
                    <>
                        <Tabs
                            className="max-md:hidden"
                            items={timeOptionsShort}
                            value={timeShort}
                            setValue={setTimeShort}
                        />
                        <Select
                            className="hidden min-w-40 max-md:block"
                            value={timeLong}
                            onChange={setTimeLong}
                            options={timeOptionsLong}
                        />
                    </>
                }
            >
                <div className="p-5 text-center text-red-500">
                    Error loading overview data: {error}
                </div>
            </Card>
        );
    }

    const overview = (overviewData as any)?.data || [];

    return (
        <Card
            className="max-lg:overflow-hidden"
            title="Overview"
            headContent={
                <>
                    <Tabs
                        className="max-md:hidden"
                        items={timeOptionsShort}
                        value={timeShort}
                        setValue={setTimeShort}
                    />
                    <Select
                        className="hidden min-w-40 max-md:block"
                        value={timeLong}
                        onChange={setTimeLong}
                        options={timeOptionsLong}
                    />
                </>
            }
        >
            <div className="relative before:hidden after:hidden before:absolute before:-left-3 before:top-0 before:bottom-0 before:z-3 before:w-8 before:bg-linear-to-r before:from-b-surface2 before:to-transparent before:pointer-events-none after:absolute after:-right-3 after:top-0 after:bottom-0 after:z-3 after:w-8 after:bg-linear-to-l after:from-b-surface2 after:to-transparent after:pointer-events-none max-lg:before:block max-lg:after:block">
                <div className="flex gap-8 p-5 pt-4 max-lg:-mx-3 max-lg:px-6 max-lg:overflow-auto max-lg:scrollbar-none">
                    {overview.map((item: any) => (
                        <Item value={item} key={item.id} />
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default Overview;

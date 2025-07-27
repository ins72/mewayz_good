import { NumericFormat } from "react-number-format";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import { usePayouts } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingStates";

const Statistics = () => {
    const { data: payoutsData, loading, error } = usePayouts({
        page: 1,
        limit: 10,
        status: "all"
    });

    if (loading) {
        return (
            <div className="card">
                <LoadingSpinner message="Loading payout statistics..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="p-5 text-center text-red-500">
                    Error loading payout statistics: {error}
                </div>
            </div>
        );
    }

    const statistics = (payoutsData as any)?.data?.statistics || [];

    return (
        <div className="card">
            <div className="flex gap-8 p-5 max-2xl:gap-6 max-lg:p-3 max-md:flex-col">
                {statistics.map((item: any) => (
                    <div
                        className="flex-1 pr-6 border-r border-shade-07/10 last:border-0 max-4xl:nth-3:hidden max-lg:nth-2:hidden max-md:pr-0 max-md:border-r-0 max-md:border-b max-md:pb-6 max-md:last:pb-0"
                        key={item.id}
                    >
                        <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-b-surface1 max-md:mb-4">
                            <Icon
                                className={`fill-t-primary ${
                                    item.title === "Future payouts"
                                        ? "-rotate-45"
                                        : ""
                                }`}
                                name={item.icon}
                            />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-sub-title-1">{item.title}</div>
                            <Tooltip content={item.tooltip} large />
                        </div>
                        <div className="flex">
                            {item.price && (
                                <div className="mt-2 mr-2.5 text-h4 text-t-secondary">
                                    $
                                </div>
                            )}
                            <NumericFormat
                                className="text-h2 max-xl:text-h3 max-lg:text-h2 max-md:text-h3"
                                value={item.price || item.counter}
                                thousandSeparator=","
                                decimalScale={item.price ? 2 : 0}
                                fixedDecimalScale
                                displayType="text"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;

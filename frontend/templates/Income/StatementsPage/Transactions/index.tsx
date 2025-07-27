import { useState } from "react";
import { NumericFormat } from "react-number-format";
import Search from "@/components/Search";
import Button from "@/components/Button";
import Select from "@/components/Select";
import NoFound from "@/components/NoFound";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Image from "@/components/Image";
import { useStatements } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingStates";

const durations = [
    { id: 1, name: "Last 7 days" },
    { id: 2, name: "Last 14 days" },
    { id: 3, name: "Last 30 days" },
];

const durationValues = {
    1: "7days",
    2: "14days", 
    3: "30days"
};

const tableHead = ["Item", "Type", "Date", "Order ID", "Price", "Amount"];

const Transactions = () => {
    const [search, setSearch] = useState("");
    const [duration, setDuration] = useState(durations[2]);
    const { data: statementsData, loading, error } = useStatements({
        page: 1,
        limit: 50,
        period: durationValues[duration.id as keyof typeof durationValues]
    });

    if (loading) {
        return (
            <div className="card">
                <LoadingSpinner message="Loading statement transactions..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="p-5 text-center text-red-500">
                    Error loading statement transactions: {error}
                </div>
            </div>
        );
    }

    const transactions = (statementsData as any)?.data || [];
    const filteredTransactions = search 
        ? transactions.filter((transaction: any) => 
            transaction.title.toLowerCase().includes(search.toLowerCase()) ||
            transaction.type.toLowerCase().includes(search.toLowerCase()) ||
            transaction.orderId.toLowerCase().includes(search.toLowerCase())
          )
        : transactions;

    return (
        <div className="card">
            <div className="flex items-center">
                <div className="pl-5 text-h6 max-lg:mr-auto max-lg:pl-3">
                    Transactions
                </div>
                <Search
                    className="w-70 ml-6 mr-auto max-lg:hidden"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    isGray
                />
                {search === "" && (
                    <>
                        <Select
                            className="min-w-45 mr-3 max-md:hidden"
                            options={durations}
                            value={duration}
                            onChange={setDuration}
                        />
                        <Button isBlack>Download CSV</Button>
                    </>
                )}
            </div>
            {filteredTransactions.length === 0 ? (
                <NoFound title="No transactions found" />
            ) : (
                <div className="p-1 pt-6 max-lg:px-0 max-md:pt-3">
                    <Table
                        cellsThead={tableHead.map((head) => (
                            <th
                                className="!h-12.5 last:text-right max-lg:nth-4:hidden max-lg:nth-5:hidden max-md:nth-2:hidden max-md:nth-3:hidden"
                                key={head}
                            >
                                {head}
                            </th>
                        ))}
                        isMobileVisibleTHead
                    >
                        {filteredTransactions.map((transaction: any) => (
                            <TableRow key={transaction.id}>
                                <td>
                                    <div className="inline-flex items-center">
                                        <div className="shrink-0">
                                            <Image
                                                className="size-16 rounded-xl opacity-100 object-cover"
                                                src={transaction.image}
                                                width={64}
                                                height={64}
                                                alt=""
                                            />
                                        </div>
                                        <div className="pl-5 max-md:w-[calc(100%-4rem)] max-md:pl-4">
                                            <div className="text-sub-title-1 max-md:max-w-[40vw] max-md:truncate">
                                                {transaction.title}
                                            </div>
                                            <div className="text-body-2 text-t-secondary/80 max-md:hidden">
                                                {transaction.category}
                                            </div>
                                            <div
                                                className={`label !hidden capitalize mt-2 max-md:!inline-flex ${
                                                    transaction.type ===
                                                    "refund"
                                                        ? "label-yellow"
                                                        : "label-green"
                                                }`}
                                            >
                                                {transaction.type}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="max-md:hidden">
                                    <div
                                        className={`label capitalize ${
                                            transaction.type === "refund"
                                                ? "label-yellow"
                                                : "label-green"
                                        }`}
                                    >
                                        {transaction.type}
                                    </div>
                                </td>
                                <td className="max-md:hidden">
                                    {transaction.date}
                                </td>
                                <td className="max-lg:hidden">
                                    {transaction.orderId}
                                </td>
                                <td className="max-lg:hidden">
                                    <NumericFormat
                                        value={transaction.price}
                                        thousandSeparator=","
                                        decimalScale={0}
                                        fixedDecimalScale
                                        displayType="text"
                                        prefix="$"
                                    />
                                </td>
                                <td className="text-right text-sub-title-2 max-md:!pl-0">
                                    <NumericFormat
                                        className={
                                            transaction.amount < 0
                                                ? "text-primary-03"
                                                : ""
                                        }
                                        value={transaction.amount}
                                        thousandSeparator=","
                                        decimalScale={2}
                                        fixedDecimalScale
                                        displayType="text"
                                        prefix={`${
                                            transaction.amount > 0 ? "+$" : "$"
                                        }`}
                                    />
                                </td>
                            </TableRow>
                        ))}
                    </Table>
                </div>
            )}
        </div>
    );
};

export default Transactions;

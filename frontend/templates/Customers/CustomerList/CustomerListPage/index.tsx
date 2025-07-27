"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Tabs from "@/components/Tabs";
import Button from "@/components/Button";
import DeleteItems from "@/components/DeleteItems";
import NoFound from "@/components/NoFound";
import Dropdown from "@/components/Dropdown";
import List from "./List";
import { Customer } from "@/types/customer";
import { useSelection } from "@/hooks/useSelection";

import { useCustomers, useCustomerMutations } from "@/hooks/useApi";

const views = [
    { id: 1, name: "Active" },
    { id: 2, name: "New" },
];

const CustomerListPage = () => {
    const [search, setSearch] = useState("");
    const [view, setView] = useState(views[0]);
    
    // Use real API data instead of mock data
    const { data: customersResponse, loading, error, refetch } = useCustomers({
        search: search || undefined,
        status: view.name.toLowerCase()
    });
    const { deleteCustomer, loading: deleteLoading } = useCustomerMutations();
    
    // Extract customers from API response
    const customers = customersResponse?.data || [];

    const {
        selectedRows,
        selectAll,
        handleRowSelect,
        handleSelectAll,
        handleDeselect,
    } = useSelection<Customer>(customers);

    // Handle customer deletion
    const handleDeleteCustomers = async () => {
        try {
            await Promise.all(
                selectedRows.map(customerId => deleteCustomer(customerId.toString()))
            );
            refetch();
            handleDeselect();
        } catch (error) {
            console.error('Failed to delete customers:', error);
        }
    };

    return (
        <Layout title="Customer list">
            <div className="card">
                {selectedRows.length === 0 ? (
                    <div className="flex items-center min-h-12">
                        <div className="pl-5 text-h6 max-lg:pl-3 max-md:mr-auto">
                            Customers
                        </div>
                        <Search
                            className="w-70 ml-6 mr-auto max-md:hidden"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name of email"
                            isGray
                        />
                        {search === "" && (
                            <>
                                <Tabs
                                    className="max-md:hidden"
                                    items={views}
                                    value={view}
                                    setValue={setView}
                                />
                                <Dropdown
                                    className="hidden max-md:block"
                                    items={views}
                                    value={view}
                                    setValue={setView}
                                />
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center">
                        <div className="mr-6 pl-5 text-h6">
                            {selectedRows.length} customer
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
                            onDelete={handleDeleteCustomers}
                            isLargeButton
                            disabled={deleteLoading}
                        />
                    </div>
                )}
                {search !== "" ? (
                    <NoFound title="No customers found" />
                ) : (
                    <div className="p-1 pt-3 max-lg:px-0">
                        <List
                            selectedRows={selectedRows}
                            onRowSelect={handleRowSelect}
                            items={customers}
                            selectAll={selectAll}
                            onSelectAll={handleSelectAll}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CustomerListPage;

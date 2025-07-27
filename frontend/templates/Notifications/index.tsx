"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Tabs from "@/components/Tabs";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Notification from "./Notification";
import Filter from "./Filter";

import { useUserNotifications, useMessageMutations } from "@/hooks/useApi";

const categories = [
    { id: 1, name: "Recent" },
    { id: 2, name: "Earlier" },
];

const NotificationsPage = () => {
    const [category, setCategory] = useState(categories[0]);
    const [isOpen, setIsOpen] = useState(false);
    
    // Use real API data instead of mock data
    const { data: notifications, loading, error, refetch } = useUserNotifications();
    const { markAllAsRead } = useMessageMutations();

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            refetch();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };
    return (
        <>
            <Layout title="Notifications">
                <div className="flex items-start">
                    <div className="col-left card mb-0 pb-8">
                        <div className="flex mb-6">
                            <Tabs
                                items={categories}
                                value={category}
                                setValue={setCategory}
                            />
                            <Button 
                                className="ml-auto max-md:!hidden" 
                                isBlack
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                            >
                                Mark all as read
                            </Button>
                            <Button
                                className="!hidden ml-3 max-lg:!flex max-md:ml-auto"
                                icon="filters"
                                isCircle
                                isStroke
                                onClick={() => setIsOpen(true)}
                            />
                        </div>
                        <div className="">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Loading notifications...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8">
                                    <p className="text-red-500">Failed to load notifications: {error}</p>
                                </div>
                            ) : notifications && notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <Notification
                                        value={notification}
                                        key={notification.id}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No notifications found</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-right card sticky top-22 px-6 pb-6 max-lg:hidden">
                        <Filter />
                    </div>
                </div>
            </Layout>
            <Modal
                classWrapper=""
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Filter />
            </Modal>
        </>
    );
};

export default NotificationsPage;

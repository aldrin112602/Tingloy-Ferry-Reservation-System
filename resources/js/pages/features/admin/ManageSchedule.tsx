import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { FerrySchedulePaginatedResponse } from '@/types';

import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AddNewSchedule from './components/AddNewSchedule';
import RouteItem from './components/RouteItem';

const breadcrumbs = [
    {
        title: 'Routes Management',
        href: '/admin/routes',
    },
];

interface AddRouteFormData {
    name: string;
    route: string;
    date_and_time: string;
    [key: string]: string;
}

const ManageSchedule = ({ paginatedResponseData }: { paginatedResponseData: FerrySchedulePaginatedResponse }) => {
    const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<AddRouteFormData>>({
        name: '',
        route: '',
        date_and_time: '',
    });

    const dialogRefStore = useRef<HTMLDialogElement>(null);

    const openAddRouteModal = () => {
        setIsAddRouteModalOpen(true);
        if (dialogRefStore.current) {
            dialogRefStore.current.showModal();
        }
    };

    const closeAddRouteModal = () => {
        setIsAddRouteModalOpen(false);
        if (dialogRefStore.current) {
            dialogRefStore.current.close();
        }
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.schedule.store'), {
            onSuccess: (response) => {
                console.log('Route added successfully:', response);
                closeAddRouteModal();
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Routes Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Schedule Management</h1>
                    <Button onClick={openAddRouteModal}>Add New Route</Button>
                </div>

                {paginatedResponseData.data.length === 0 ? (
                    <div className="rounded-lg bg-white py-12 text-center shadow">
                        <p className="text-gray-500">No routes available.</p>
                        <button
                            onClick={openAddRouteModal}
                            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Create Your First Route
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedResponseData.data.map((route) => (
                            <RouteItem key={route.id} route={route} />
                        ))}
                    </div>
                )}

                {paginatedResponseData.data.length > 0 && paginatedResponseData.links && paginatedResponseData.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {paginatedResponseData.links.map((link, i) => {
                            if ((link.label === '&laquo; Previous' || link.label === 'Next &raquo;') && link.url === null) {
                                return null;
                            }
                            return (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded px-3 py-1 ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url === null
                                              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                              : 'bg-white text-blue-600 hover:bg-blue-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}

                <AddNewSchedule
                    dialogRefStore={dialogRefStore}
                    closeAddRouteModal={closeAddRouteModal}
                    handleSubmit={handleSubmit}
                    data={data}
                    errors={errors}
                    setData={setData}
                    processing={processing}
                />
            </div>
        </AppLayout>
    );
};

export default ManageSchedule;

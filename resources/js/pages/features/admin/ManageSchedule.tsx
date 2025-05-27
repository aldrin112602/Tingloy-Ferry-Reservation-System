import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { AddRouteFormData, FerrySchedulePaginatedResponse } from '@/types';

import { RouteProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AddNewSchedule from './components/AddNewSchedule';
import EditSchedule from './components/EditSchedule';
import RouteItem from './components/RouteItem';

const breadcrumbs = [
    {
        title: 'Routes Management',
        href: '/admin/routes',
    },
];



const ManageSchedule = ({ paginatedResponseData }: { paginatedResponseData: FerrySchedulePaginatedResponse }) => {
    const [routeObj, setRouteObj] = useState({});
    const { data, setData, post, processing, errors, reset } = useForm<Required<AddRouteFormData>>({
        name: '',
        route: '',
        date_and_time: '',
    });

    const dialogRefStore = useRef<HTMLDialogElement>(null);
    const dialogRefEdit = useRef<HTMLDialogElement>(null);

    const openAddRouteModal = () => {
        if (dialogRefStore.current) {
            dialogRefStore.current.showModal();
        }
    };

    const openEditRouteModal = (route: RouteProps) => {
        setRouteObj(route);
        if (dialogRefEdit.current) {
            dialogRefEdit.current.showModal();
        }
    };

    const closeAddRouteModal = () => {
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
                            <RouteItem key={route.id} route={route} openEditDialog={openEditRouteModal} />
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

                <EditSchedule dialogRefEdit={dialogRefEdit} routeObj={routeObj} />
            </div>
        </AppLayout>
    );
};

export default ManageSchedule;

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { FerrySchedulePaginatedResponse } from '@/types';

import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useRef, useState } from 'react';
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

    const dialogRef = useRef<HTMLDialogElement>(null);

    const openAddRouteModal = () => {
        setIsAddRouteModalOpen(true);
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };

    const closeAddRouteModal = () => {
        setIsAddRouteModalOpen(false);
        if (dialogRef.current) {
            dialogRef.current.close();
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
                console.log(error)
            }
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

                <dialog ref={dialogRef} className="mx-auto my-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Add New Schedule</h2>
                        <Button onClick={closeAddRouteModal} className="bg-slate-50 text-black hover:text-white">
                            ✕
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} method="dialog">
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Shedule Name</label>
                            <Input type="text" name='name' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} />
                        </div>

                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Select Route</label>
                            <select
                                value={data.route}
                                name="route"
                                onChange={(e) => setData('route', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-gray-500 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value={''} disabled className="hidden">-- Select route --</option>
                                <option value="Mabini to Tingloy">Mabini to Tingloy</option>
                                <option value="Tingloy to Mabini">Tingloy to Mabini</option>
                            </select>

                            <InputError message={errors.route} />
                        </div>

                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Date and Time</label>
                            <Input
                                type="datetime-local"
                                value={data.date_and_time}
                                onChange={(e) => setData('date_and_time', e.target.value)}
                                required
                                name='date_and_time'
                            />
                            <InputError message={errors.date_and_time} />
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button
                                onClick={closeAddRouteModal}
                                type="button"
                                className="border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                                tabIndex={5}
                                disabled={processing}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" tabIndex={6} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? 'Adding...' : 'Add Route'}
                            </Button>
                        </div>
                    </form>
                </dialog>
            </div>
        </AppLayout>
    );
};

export default ManageSchedule;

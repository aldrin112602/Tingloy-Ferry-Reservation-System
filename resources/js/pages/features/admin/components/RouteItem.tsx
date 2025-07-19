import { RouteItemProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import Swal from 'sweetalert2';

const RouteItem = ({
    route,
    onDelete,
    openEditDialog,
}: RouteItemProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { delete: destroy, processing } = useForm();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert this!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                destroy(`/admin/schedule/${route.id}`, {
                    onSuccess: () => {
                        Swal.fire('Deleted!', 'The route has been deleted.', 'success');
                        onDelete?.();
                    },
                    onError: () => {
                        Swal.fire('Error', 'Something went wrong while deleting.', 'error');
                    },
                    preserveScroll: true,
                });
            } catch (error) {
                Swal.fire('Error', 'Failed to delete. Please try again.', 'error');
            }
        }
    };

    const getStatusClass = (status: string): string => {
    switch (status) {
        case 'scheduled':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'departed':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'in_transit':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'arrived':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'cancelled':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
};

    return (
        <div className="mb-4 flex flex-col items-start justify-between rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:text-gray-100 md:flex-row md:items-center">
            <div className="flex-1">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                    <h3 className="text-lg font-semibold">{route.name}</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700 dark:text-gray-300">
                        Code: {route.route_code}
                    </span>
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusClass(route.status)}`}
                    >
                        {route.status.toUpperCase()}
                    </span>
                </div>

                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        {route.start_location} → {route.end_location}
                    </p>
                    <p>
                        <span className="mr-4">Date: {format(new Date(route.date_and_time), 'PPP')}</span>
                        <span>Time: {format(new Date(route.date_and_time), 'p')}</span>
                    </p>
                    <p className="mt-1">
                        Capacity: {route.seats_occupied}/{route.capacity} seats occupied
                    </p>
                </div>
            </div>

            <div className="mt-4 flex gap-2 md:mt-0">
                <button
                    onClick={() => openEditDialog(route)}
                    className="cursor-pointer rounded bg-yellow-50 px-3 py-1 text-xs text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                >
                    Edit
                </button>

                <button
                    onClick={handleDelete}
                    disabled={processing}
                    className={`rounded px-3 py-1 text-xs ${
                        confirmDelete
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                    }`}
                >
                    {confirmDelete ? 'Confirm' : 'Delete'}
                </button>
                {confirmDelete && (
                    <button
                        onClick={() => setConfirmDelete(false)}
                        className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default RouteItem;

import { RouteProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

const RouteItem = ({ route, onDelete }: { route: RouteProps; onDelete?: () => void }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        console.log('Deleting route:', route.id);
    };

    return (
        <div className="mb-4 flex flex-col items-start justify-between rounded-lg bg-white p-4 shadow md:flex-row md:items-center">
            <div className="flex-1">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                    <h3 className="text-lg font-semibold">{route.name}</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">Code: {route.route_code}</span>
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${
                            route.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {route.status}
                    </span>
                </div>

                <div className="mt-2 text-sm text-gray-600">
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
                <Link href={`/admin/${route.id}/edit`} className="rounded bg-yellow-50 px-3 py-1 text-xs text-yellow-600 hover:bg-yellow-100">
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={processing}
                    className={`rounded px-3 py-1 text-xs ${
                        confirmDelete ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                >
                    {confirmDelete ? 'Confirm' : 'Delete'}
                </button>
                {confirmDelete && (
                    <button onClick={() => setConfirmDelete(false)} className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200">
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};
export default RouteItem;

import AppLayout from '@/layouts/app-layout';
import { FerrySchedulePaginatedResponse, Passenger, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Ship } from 'lucide-react';
import { useState } from 'react';
import CardDisplayData from './components/CardDisplayData';
import PaginationLink from './components/PaginationLink';
import ViewPassengers from './components/ViewPassengers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Passenger List',
        href: 'staff/passengers',
    },
];

const PassengerList = ({ paginatedResponseData }: { paginatedResponseData: FerrySchedulePaginatedResponse }) => {
    const [isOpenDialog, setISOpenDialog] = useState(false);
    const [passengersArr, setPassengersArr] = useState<Passenger[]>([]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Passenger List" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Ferry Schedules</h1>

                {paginatedResponseData.data.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <CardDisplayData
                            paginatedResponseData={paginatedResponseData}
                            setPassengersArr={setPassengersArr}
                            setISOpenDialog={setISOpenDialog}
                        />
                    </div>
                ) : (
                    <div className="flex h-60 w-full items-center justify-center rounded-lg border border-dashed">
                        <div className="text-center">
                            <Ship className="mx-auto h-10 w-10 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium">No ferry schedules found</h3>
                            <p className="text-sm text-gray-500">There are no active ferry schedules at the moment.</p>
                        </div>
                    </div>
                )}

                {paginatedResponseData.data.length > 0 && paginatedResponseData.links && paginatedResponseData.links.length > 3 && (
                    <PaginationLink paginatedResponseData={paginatedResponseData} />
                )}
            </div>

            <ViewPassengers isOpenDialog={isOpenDialog} setISOpenDialog={setISOpenDialog} passengersArr={passengersArr} />
        </AppLayout>
    );
};

export default PassengerList;

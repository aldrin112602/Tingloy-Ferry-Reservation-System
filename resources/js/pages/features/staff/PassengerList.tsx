import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'passenger list',
        href: 'staff/passengers',
    },
];

const PassengerList = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Passenger List" />

        </AppLayout>
    );
};

export default PassengerList;

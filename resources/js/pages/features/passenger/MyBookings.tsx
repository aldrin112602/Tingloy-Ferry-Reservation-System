import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { MyBookingsProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import DisplayBookings from './components/my-bookings/DisplayBookings';
import NoBookingsFound from './components/my-bookings/NoBookingsFound';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Bookings',
        href: '/passenger/bookings',
    },
];

const formatDate = (dateString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-blue-100 text-blue-800';
    }
};

export default function MyBookings({ bookings }: MyBookingsProps) {
    const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

    const toggleBooking = (id: number) => {
        setExpandedBooking(expandedBooking === id ? null : id);
    };

    const handleEdit = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
        if (!result.isConfirmed) return;
        /**
         * TODO: Implement delete booking functionality
         * This is a placeholder for the delete booking functionality.
         */
        Swal.fire('Success!', 'Your booking has been deleted.', 'success');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings" />
            <div className="mx-auto w-full p-4 md:p-6">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
                    <Badge className="px-3 py-1 text-sm">
                        {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                    </Badge>
                </div>

                {!bookings.length ? (
                    <NoBookingsFound />
                ) : (
                    <DisplayBookings
                        bookings={bookings}
                        toggleBooking={toggleBooking}
                        handleEdit={handleEdit}
                        getStatusColor={getStatusColor}
                        expandedBooking={expandedBooking}
                        handleDelete={handleDelete}
                        formatDate={formatDate}
                    />
                )}
            </div>
        </AppLayout>
    );
}

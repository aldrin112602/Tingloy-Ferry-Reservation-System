import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { MyBookingsProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import DisplayBookings from './components/my-bookings/DisplayBookings';
import NoBookingsFound from './components/my-bookings/NoBookingsFound';
import axios from 'axios';


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

    const handleCancel = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            const { value: cancellationReason } = await Swal.fire({
                title: 'Enter Cancellation Reason',
                input: 'textarea',
                inputLabel: 'Please tell us why you are canceling this booking:',
                inputPlaceholder: 'Type your reason here...',
                inputAttributes: {
                    'aria-label': 'Type your cancellation reason here'
                },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Submit Reason',
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to write something!';
                    }
                }
            });

            if (cancellationReason) {
                try {
                   
                    const response = await axios.post(`/passenger/bookings/${id}/cancel`, {
                        cancellation_reason: cancellationReason
                    });

                    if (response.status === 200) {
                        await Swal.fire(
                            'Canceled!',
                            'Your booking has been canceled.',
                            'success'
                        );
                        location.reload();
                    } else {
                        Swal.fire(
                            'Error!',
                            response.data.message || 'Failed to cancel booking. Please try again.',
                            'error'
                        );
                    }
                } catch (error: any) {
                    console.error('Cancellation error:', error);
                    let errorMessage = 'Failed to cancel booking. Please try again.';
                    if (error.response && error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    Swal.fire(
                        'Error!',
                        errorMessage,
                        'error'
                    );
                }
            } else {
                console.log('Cancellation reason not provided. Aborting.');
                Swal.fire(
                    'Aborted',
                    'Cancellation was not completed as no reason was provided.',
                    'info'
                );
            }
        } else {
            console.log('Cancellation aborted by user.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings" />
            <div className="mx-auto w-full p-4 md:p-6">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300">My Bookings</h1>
                    <Badge className="px-3 py-1 text-sm">
                        {bookings.length} <span className="ml-1"></span> {bookings.length === 1 ? 'Booking' : 'Bookings'}
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
                        handleCancel={handleCancel}
                    />
                )}
            </div>
        </AppLayout>
    );
}

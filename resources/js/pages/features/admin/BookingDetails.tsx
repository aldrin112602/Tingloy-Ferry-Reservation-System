import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import { useState } from 'react';

interface Passenger {
    id: number;
    booking_id: number;
    full_name: string;
    age: number;
    contact_number: string;
    address: string;
    residency_status: string;
    is_main_passenger: boolean;
    created_at: string;
    updated_at: string;
}

interface Route {
    id: number;
    name: string;
    route_code: string;
    start_location: string;
    end_location: string;
    capacity: number;
    date_and_time: string;
    seats_occupied: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface BookingData {
    id: number;
    user_id: number;
    route_id: number;
    ticket_code: string;
    number_of_passengers: number;
    status: string;
    passengers: Passenger[];
    route: Route;
}

export interface BookingDetailsProps {
    booking: BookingData;
}

const breadcrumbs = [
    { title: 'Bookings Management', href: '/admin/bookings' },
    { title: 'Bookings Details', href: '/admin/bookings/details' },
];

const BookingDetails = ({ booking }: BookingDetailsProps) => {
    const [processing, setProcessing] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: 'approve' | 'decline' | null }>({
        open: false,
        action: null,
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">Approved</span>;
            case 'declined':
                return <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">Declined</span>;
            case 'pending':
                return <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">Pending</span>;
            default:
                return <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">{status}</span>;
        }
    };

    const handleAction = async (action: 'approve' | 'decline') => {
        setProcessing(true);
        try {
            // Replace with your actual endpoint
            await router.post(
                `/admin/bookings/${booking.id}/${action}`,
                {},
                {
                    onSuccess: () => {
                        setConfirmModal({ open: false, action: null });
                        // You might want to refresh the page or update the data
                    },
                    onError: () => {
                        // Handle errors
                    },
                },
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Details" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Booking Details</h1>
                    {booking.status.toLowerCase() === 'pending' && (
                        <div className="space-x-3">
                            <button
                                onClick={() => setConfirmModal({ open: true, action: 'approve' })}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                Approve Booking
                            </button>
                            <button
                                onClick={() => setConfirmModal({ open: true, action: 'decline' })}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Decline Booking
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Booking Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">Booking Information</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Booking Status</p>
                                <div className="mt-1">{getStatusBadge(booking.status)}</div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Ticket Code</p>
                                <p className="mt-1 font-mono text-sm font-medium">{booking.ticket_code}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Number of Passengers</p>
                                <div className="mt-1 flex items-center">
                                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                                    <p>{booking.number_of_passengers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Route Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">Route Information</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Route Name</p>
                                <p className="mt-1 font-medium">{booking.route.name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Route Code</p>
                                <p className="mt-1 font-mono text-sm">{booking.route.route_code}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">From</p>
                                    <div className="mt-1 flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                                        <p>{booking.route.start_location}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">To</p>
                                    <div className="mt-1 flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                                        <p>{booking.route.end_location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date</p>
                                    <div className="mt-1 flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                        <p>{formatDate(booking.route.date_and_time)}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Time</p>
                                    <div className="mt-1 flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                        <p>{formatTime(booking.route.date_and_time)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Capacity</p>
                                    <p className="mt-1">{booking.route.capacity} seats</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Seats Occupied</p>
                                    <p className="mt-1">{booking.route.seats_occupied} seats</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Passengers Information */}
                <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold">Passenger Information</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Age
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Contact Number
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Address
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Residency Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Type
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {booking.passengers.map((passenger) => (
                                    <tr key={passenger.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4 text-gray-500" />
                                                <div className="text-sm font-medium text-gray-900">{passenger.full_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{passenger.age}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{passenger.contact_number}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{passenger.address}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                    passenger.residency_status === 'resident'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}
                                            >
                                                {passenger.residency_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {passenger.is_main_passenger ? (
                                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Main</span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                                    Additional
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {confirmModal.open && (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                                &#8203;
                            </span>

                            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <AlertCircle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                {confirmModal.action === 'approve' ? 'Approve Booking' : 'Decline Booking'}
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Are you sure you want to {confirmModal.action} this booking? This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => handleAction(confirmModal.action!)}
                                        className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm ${
                                            confirmModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                        } ${processing ? 'opacity-75' : ''}`}
                                    >
                                        {processing ? 'Processing...' : confirmModal.action === 'approve' ? 'Approve' : 'Decline'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => setConfirmModal({ open: false, action: null })}
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default BookingDetails;

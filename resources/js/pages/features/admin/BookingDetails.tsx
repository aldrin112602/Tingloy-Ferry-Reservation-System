import AppLayout from '@/layouts/app-layout';
import { BookingDetailsProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Calendar, Clock, HandCoins, LoaderCircle, MapPin, PhilippinePeso, User, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = [
    { title: 'Bookings Management', href: '/admin/bookings' },
    { title: 'Bookings Details', href: '/admin/bookings/details' },
];

const BookingDetails = ({ booking }: BookingDetailsProps) => {
    const [processing, setProcessing] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: 'approved' | 'rejected' | null }>({
        open: false,
        action: null,
    });

    const baseUrl = window.location.origin;

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
        // Updated for Dark Mode
        switch (status.toLowerCase()) {
            case 'approved':
                return <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-700 dark:text-green-100">Approved</span>;
            case 'declined':
                return <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-700 dark:text-red-100">Declined</span>;
            case 'pending':
                return <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100">Pending</span>;
            default:
                return <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-100">{status}</span>;
        }
    };

    const handleAction = async (action: 'approved' | 'rejected') => {
        if (!processing) {
            setProcessing(true);
            try {
                await router.post(
                    action === 'approved' ? route('admin.bookings.approve', booking.id) : route('admin.bookings.reject', booking.id),
                    {},
                    {
                        onSuccess: (page) => {
                            if (Object.keys(page.props.errors || {}).length === 0) {
                                setConfirmModal({ open: false, action: null });
                            } else {
                                // Handle specific errors if needed
                            }
                        },
                        onError: () => {
                            // Handle Inertia errors, maybe with a toast or SweetAlert
                        },
                    },
                );
            } finally {
                setProcessing(false);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Details" />
            <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen"> {/* Added dark mode background */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-gray-100">Booking Details</h1>
                    {booking.status.toLowerCase() === 'pending' && (
                        <div className="space-x-3">
                            <button
                                onClick={() => setConfirmModal({ open: true, action: 'approved' })}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700
                                           dark:bg-green-700 dark:hover:bg-green-600" // Dark mode for green button
                            >
                                Approve Booking
                            </button>
                            <button
                                onClick={() => setConfirmModal({ open: true, action: 'rejected' })}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700
                                           dark:bg-red-700 dark:hover:bg-red-600" // Dark mode for red button
                            >
                                Decline Booking
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Booking Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-md
                                   dark:bg-gray-800 dark:shadow-lg"> {/* Dark mode for card background/shadow */}
                        <h2 className="mb-4 text-lg font-semibold dark:text-gray-100">Booking Information</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking Status</p>
                                <div className="mt-1">{getStatusBadge(booking.status)}</div>
                            </div>

                            {
                                booking.status === 'canceled' && (
                                    <>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancellation Reason</p>
                                            <mark className="mt-1">{booking.cancellation_reason || ''}</mark>
                                        </div>
                                    </>
                                )
                            }


                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Code</p>
                                <p className="mt-1 font-mono text-sm font-medium dark:text-gray-200">{booking.ticket_code}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Passengers</p>
                                <div className="mt-1 flex items-center">
                                    <Users className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <p className="dark:text-gray-200">{booking.number_of_passengers}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mode of Payment</p>
                                <div className="mt-1 flex items-center">
                                    <HandCoins className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <p className="dark:text-gray-200">{booking.payment_method}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fare</p>
                                <div className="mt-1 flex items-center">
                                    <PhilippinePeso className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <p className="dark:text-gray-200">{booking.total_fee}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploaded Receipt</p>
                                {booking.receipt_image ? (
                                    <a
                                        className="inline-block hover:shadow-lg"
                                        href={`${baseUrl}/storage/${booking.receipt_image}`}
                                        title="Open Image to a new tab?"
                                        target="_blank"
                                    >
                                        <img
                                            src={`${baseUrl}/storage/${booking.receipt_image}`}
                                            width={'50px'}
                                            height={'50px'}
                                            className="cursor-pointer object-cover" // Image itself usually doesn't need dark mode style
                                        />
                                    </a>
                                ) : (
                                    <span className="text-gray-400 italic dark:text-gray-500">No Image Uploaded</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Route Information Card */}
                    <div className="rounded-lg bg-white p-6 shadow-md
                                   dark:bg-gray-800 dark:shadow-lg"> {/* Dark mode for card background/shadow */}
                        <h2 className="mb-4 text-lg font-semibold dark:text-gray-100">Route Information</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Route Name</p>
                                <p className="mt-1 font-medium dark:text-gray-200">{booking.route.name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Route Code</p>
                                <p className="mt-1 font-mono text-sm dark:text-gray-200">{booking.route.route_code}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">From</p>
                                    <div className="mt-1 flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <p className="dark:text-gray-200">{booking.route.start_location}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To</p>
                                    <div className="mt-1 flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <p className="dark:text-gray-200">{booking.route.end_location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                                    <div className="mt-1 flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <p className="dark:text-gray-200">{formatDate(booking.route.date_and_time)}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                                    <div className="mt-1 flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <p className="dark:text-gray-200">{formatTime(booking.route.date_and_time)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</p>
                                    <p className="mt-1 dark:text-gray-200">{booking.route.capacity} seats</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Seats Occupied</p>
                                    <p className="mt-1 dark:text-gray-200">{booking.route.seats_occupied} seats</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Passengers Information */}
                <div className="mt-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-lg">
                    <h2 className="mb-4 text-lg font-semibold dark:text-gray-100">Passenger Information</h2>

                    {
                        (booking.children_counts || booking.childrens_contact_person || booking.childrens_contact_number) && (
                            <div className='block md:flex justify-between'>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Children (Ages 0–6)</p>
                                    <p className="mt-1 dark:text-gray-200">{booking.children_counts || 0} child(ren)</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Children's Contact Person</p>
                                    <p className="mt-1 dark:text-gray-200">{booking.childrens_contact_person || 'N/A'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Children's Contact Number</p>
                                    <p className="mt-1 dark:text-gray-200">{booking.childrens_contact_number || 'N/A'}</p>
                                </div>
                            </div>
                        )
                    }

                    <div className="mx-auto overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"> {/* Dark mode for table dividers */}
                            <thead className="bg-gray-50 dark:bg-gray-700"> {/* Dark mode for table header */}
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Age
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Contact Number
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Address
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Valid ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Fare
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Fare Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Residency Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Type
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"> {/* Dark mode for table body */}
                                {booking.passengers.map((passenger) => (
                                    <tr key={passenger.id}>
                                        {/* Full Name with icon */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{passenger.full_name}</div>
                                            </div>
                                        </td>

                                        {/* Age */}
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{passenger.age}</td>

                                        {/* Contact Number */}
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{passenger.contact_number}</td>

                                        {/* Address */}
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{passenger.address}</td>

                                        {/* File (download link) */}
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-blue-600">
                                            {passenger.id_file ? (
                                                <a
                                                    className="inline-block hover:shadow-lg"
                                                    href={`${baseUrl}/storage/${passenger.id_file}`}
                                                    title="Open Image to a new tab?"
                                                    target="_blank"
                                                >
                                                    <img
                                                        src={`${baseUrl}/storage/${passenger.id_file}`}
                                                        width={'50px'}
                                                        height={'50px'}
                                                        className="cursor-pointer object-cover"
                                                    />
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic dark:text-gray-500">No Image Uploaded</span>
                                            )}
                                        </td>

                                        {/* Fare */}
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-200">₱{passenger.passenger_fare}</td>

                                        {/* Fare Type */}
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{passenger.passenger_fare_type}</td>

                                        {/* Residency Status */}
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${passenger.residency_status === 'resident'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100'
                                                    }`}
                                            >
                                                {passenger.residency_status}
                                            </span>
                                        </td>

                                        {/* Passenger Type (Main or Additional) */}
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {passenger.is_main_passenger ? (
                                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-700 dark:text-green-100">Main</span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-100">
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
                                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div> {/* Dark mode for overlay */}
                            </div>

                            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                                &#8203;
                            </span>

                            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle
                                           dark:bg-gray-800 dark:shadow-2xl"> {/* Dark mode for modal background/shadow */}
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800"> {/* Dark mode for modal content area */}
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10
                                                       dark:bg-red-700"> {/* Dark mode for icon background */}
                                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-100" /> {/* Dark mode for icon color */}
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"> {/* Dark mode for title */}
                                                {confirmModal.action === 'approved' ? 'Approve Booking' : 'Decline Booking'}
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-300"> {/* Dark mode for description */}
                                                    Are you sure you want to {confirmModal.action} this booking? This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700"> {/* Dark mode for footer */}
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => {
                                            setProcessing(true);
                                            handleAction(confirmModal.action!);
                                        }}
                                        className={`inline-flex w-full items-center justify-center gap-3 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm ${confirmModal.action === 'approved' ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600' : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                                            } ${processing ? 'opacity-75' : ''}`}
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? 'Processing...' : confirmModal.action === 'approved' ? 'Approve' : 'Decline'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => setConfirmModal({ open: false, action: null })}
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                                                   dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
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
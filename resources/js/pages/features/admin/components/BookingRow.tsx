import { BookingRowProps } from '@/types';
import { router } from '@inertiajs/react';
import React from 'react';

const BookingActions: React.FC<BookingRowProps> = ({ booking }) => {
    const handleView = () => {
        router.get(route('admin.bookings.show', booking.id), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="flex space-x-2">
            <button
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 transition duration-150 ease-in-out"
                onClick={handleView}
            >
                View
            </button>
        </div>
    );
};

const BookingRow: React.FC<BookingRowProps> = ({ booking }) => {
    const baseUrl = window.location.origin;

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <tr className="hover:bg-gray-50 dark:bg-gray-700">
            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {booking.ticket_code}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                {booking.number_of_passengers}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                {booking.receipt_image ? (
                    <a
                        className="inline-block hover:shadow-lg"
                        href={`${baseUrl}/storage/${booking.receipt_image}`}
                        title="Open image in new tab"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={`${baseUrl}/storage/${booking.receipt_image}`}
                            alt="Receipt"
                            width="50"
                            height="50"
                            className="cursor-pointer object-cover rounded"
                        />
                    </a>
                ) : (
                    'No Image Uploaded'
                )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                {booking.payment_method}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                {booking.total_fee} PHP
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(booking.status)}`}
                >
                    {booking.status}
                </span>
            </td>
            <td className="px-4 py-3 text-sm whitespace-nowrap">
                <BookingActions booking={booking} />
            </td>
        </tr>
    );
};

export default BookingRow;

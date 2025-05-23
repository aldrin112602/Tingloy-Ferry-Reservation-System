import { BookingRowProps } from '@/types';
import { router } from '@inertiajs/react';
import React from 'react';

const BookingRow: React.FC<BookingRowProps> = ({ booking }) => {
    const baseUrl = window.location.origin;

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">{booking.ticket_code}</td>
            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-500">{booking.number_of_passengers}</td>
            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-500">
                {booking.receipt_image ? (
                    <a className='inline-block hover:shadow-lg' href={`${baseUrl}/storage/${booking.receipt_image}`} title="Open Image to a new tab?" target="_blank">
                        <img
                            src={`${baseUrl}/storage/${booking.receipt_image}`}
                            width={'50px'}
                            height={'50px'}
                            className="cursor-pointer object-cover"
                        />
                    </a>
                ) : (
                    'No Image Uploaded'
                )}
            </td>
            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-500">{booking.payment_method}</td>
            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-500">{booking.total_fee} PHP</td>
            <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${getStatusClass(booking.status)}`}>
                    {booking.status}
                </span>
            </td>
            <td className="px-4 py-3 text-sm whitespace-nowrap">
                <BookingActions booking={booking} />
            </td>
        </tr>
    );
};

const BookingActions: React.FC<BookingRowProps> = ({ booking }) => {
    const handleView = () => {
        router.get(route('admin.bookings.show', booking.id), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-900" onClick={handleView}>
                View
            </button>
        </div>
    );
};

export default BookingRow;

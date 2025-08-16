import { UserBookingsProps } from '@/types';
import React from 'react';
import BookingRow from './BookingRow';

const UserBookings: React.FC<UserBookingsProps> = ({ bookings }) => {
    if (bookings.length === 0) {
        return (
            <div className="mt-4 rounded-lg bg-white p-4 text-center text-sm text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400">
                No bookings found.
            </div>
        );
    }

    return (
        <div className="mt-6 overflow-auto rounded-lg bg-white shadow dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Booking Reference Code</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Passengers</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Receipt</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Payment Method</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Total Fare</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Status</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {bookings.map((booking) => (
                        <BookingRow key={booking.id} booking={booking} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserBookings;

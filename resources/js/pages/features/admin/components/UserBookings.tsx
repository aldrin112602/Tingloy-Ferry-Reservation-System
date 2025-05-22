import { UserBookingsProps } from '@/types';
import React from 'react';
import BookingRow from './BookingRow';



const UserBookings: React.FC<UserBookingsProps> = ({ bookings }) => {
    if (bookings.length === 0) {
        return <p className="text-sm text-gray-500">No bookings found</p>;
    }

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Ticket Code
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Passengers
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Receipt
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Payment Method
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Total fare
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <BookingRow key={booking.id} booking={booking} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserBookings;

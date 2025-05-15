import React from 'react';
import { BookingTableProps } from '@/types';
import UserRow from './UserRow';



const BookingTable: React.FC<BookingTableProps> = ({ users, expandedUser, toggleUserExpand }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            User Info
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Total Bookings
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((user) => (
                        <UserRow 
                            key={user.id}
                            user={user}
                            isExpanded={expandedUser === user.id}
                            toggleExpand={() => toggleUserExpand(user.id)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingTable;
import { UserRowProps } from '@/types';
import React from 'react';
import UserBookings from './UserBookings';

const UserRow: React.FC<UserRowProps> = ({ user, isExpanded, toggleExpand }) => {
    const userInitials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('');

    return (
        <React.Fragment>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                            <span className="font-medium text-gray-700">{userInitials}</span>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">{user.role}</span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{user.booking.length}</td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <button onClick={toggleExpand} className="flex items-center gap-1 text-blue-600 hover:text-blue-900">
                        {isExpanded ? (
                            <>
                                Hide Details
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                </svg>
                            </>
                        ) : (
                            <>
                                View Details
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </>
                        )}
                    </button>
                </td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan={4} className="bg-gray-50 px-6 py-4">
                        <div className="py-2">
                            <h3 className="mb-2 text-sm font-medium text-gray-700">Booking History</h3>
                            <UserBookings bookings={user.booking} />
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

export default UserRow;

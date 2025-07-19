import AppLayout from '@/layouts/app-layout';
import { BookingProps, User } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import BookingTable from './components/BookingTable';
import EmptyState from './components/EmptyState';
import SearchFilters from './components/SearchFilters';

const breadcrumbs = [
    {
        title: 'Bookings Management',
        href: '/admin/bookings',
    },
];

interface ManageBookingsProps extends User {
    booking: BookingProps[];
}

const ManageBookings = ({ users }: { users: ManageBookingsProps[] }) => {
    const [expandedUser, setExpandedUser] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const toggleUserExpand = (userId: number) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;

        return matchesSearch && user.booking.some((booking) => booking.status === statusFilter);
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings Management" />

            <div className="rounded-lg bg-white dark:bg-gray-900 p-6 shadow-md">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Bookings Management
                    </h1>

                    <SearchFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                </div>

                {filteredUsers.length === 0 ? (
                    <EmptyState message="No bookings match your search criteria" />
                ) : (
                    <BookingTable
                        users={filteredUsers}
                        expandedUser={expandedUser}
                        toggleUserExpand={toggleUserExpand}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default ManageBookings;

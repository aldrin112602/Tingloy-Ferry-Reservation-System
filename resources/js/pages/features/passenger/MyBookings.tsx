import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { MyBookingsProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, ChevronDown, ChevronRight, Clock, Edit, MapPin, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

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
        // Handle edit logic here - could redirect to edit page
        console.log(`Editing booking ${id}`);
        // Example: router.push(`/passenger/bookings/${id}/edit`);
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
        if(!result.isConfirmed) return;
        Swal.fire('Success!', 'Your booking has been deleted.', 'success');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings" />

            <div className="mx-auto max-w-5xl p-4 md:p-6">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
                    <Badge className="px-3 py-1 text-sm">
                        {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                    </Badge>
                </div>

                {bookings.length === 0 ? (
                    <div className="rounded-lg bg-gray-50 p-10 text-center">
                        <div className="mb-4 text-gray-400">
                            <Calendar size={48} className="mx-auto" />
                        </div>
                        <h3 className="mb-2 text-xl font-medium text-gray-700">No Bookings Found</h3>
                        <p className="text-gray-500">You don't have any bookings yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <Card key={booking.id} className="overflow-hidden border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                                <div onClick={() => toggleBooking(booking.id)} className="cursor-pointer">
                                    <CardHeader className="bg-gray-50 py-2">
                                        <div className="flex items-center justify-between md:hidden">
                                            <CardTitle className="text-lg">
                                                {booking.origin} to {booking.destination}
                                            </CardTitle>
                                            <Badge className={`${getStatusColor(booking.status)}`}>{booking.status}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="lg:flex md:block items-center space-x-2 hidden">
                                                <CardTitle className="text-lg">
                                                    {booking.origin} to {booking.destination}
                                                </CardTitle>
                                                <Badge className={`${getStatusColor(booking.status)}`}>{booking.status}</Badge>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className="hidden text-sm font-medium text-gray-500 lg:inline">
                                                    Ticket: {booking.ticket_code}
                                                </span>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-blue-200 px-2 text-blue-600 hover:bg-blue-50"
                                                        onClick={(e) => handleEdit(booking.id, e)}
                                                    >
                                                        <Edit size={16} className="mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-red-200 px-2 text-red-600 hover:bg-red-50"
                                                        onClick={(e) => handleDelete(booking.id, e)}
                                                    >
                                                        <Trash2 size={16} className="mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                                {expandedBooking === booking.id ? (
                                                    <ChevronDown size={20} className="text-gray-400" />
                                                ) : (
                                                    <ChevronRight size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4">
                                        <div className="flex flex-wrap gap-6">
                                            <div className="flex items-center">
                                                <Calendar size={16} className="mr-2 text-gray-500" />
                                                <span>{formatDate(booking.travel_date)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock size={16} className="mr-2 text-gray-500" />
                                                <span>
                                                    {new Date(booking.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users size={16} className="mr-2 text-gray-500" />
                                                <span>
                                                    {booking.number_of_passengers} {booking.number_of_passengers === 1 ? 'Passenger' : 'Passengers'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin size={16} className="mr-2 text-gray-500" />
                                                <span className="flex items-center">
                                                    <span className="font-medium">{booking.origin}</span>
                                                    <span className="mx-2">→</span>
                                                    <span className="font-medium">{booking.destination}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>

                                {expandedBooking === booking.id && (
                                    <CardFooter className="block border-t border-gray-100 bg-gray-50 p-4">
                                        <h4 className="mb-3 font-medium">Passenger Information</h4>
                                        <ul className="divide-y divide-gray-100">
                                            {booking.passengers.map((passenger, index) => (
                                                <li key={index} className="flex justify-between py-2">
                                                    <span>{passenger.full_name}</span>
                                                    {passenger.is_main_passenger && (
                                                        <Badge className="bg-blue-100 text-blue-800">Main Passenger</Badge>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

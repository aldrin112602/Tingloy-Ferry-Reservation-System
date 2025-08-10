import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button component
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type DisplayBookingsProps } from '@/types';
import { Calendar, ChevronDown, ChevronRight, Clock, MapPin, Users, Ban } from 'lucide-react'; // Import Ban icon

const DisplayBookings = ({
    bookings,
    toggleBooking,
    handleEdit,
    getStatusColor,
    expandedBooking,
    handleDelete,
    formatDate,
    handleCancel,
}: DisplayBookingsProps) => {
    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <Card
                    key={booking.id}
                    className="overflow-hidden border border-gray-200 shadow-sm transition-shadow hover:shadow-md
                               dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg dark:hover:shadow-xl"
                >
                    <div onClick={() => toggleBooking(booking.id)} className="cursor-pointer">
                        <CardHeader className="bg-gray-50 py-2 dark:bg-gray-700">
                            <div className="flex items-center justify-between md:hidden">
                                <CardTitle className="text-lg dark:text-gray-100">
                                    {booking?.route?.start_location} to {booking?.route?.end_location}
                                </CardTitle>
                                <Badge className={`${getStatusColor(booking.status)}`}>{booking.status}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="hidden items-center space-x-2 md:block lg:flex">
                                    <CardTitle className="text-lg dark:text-gray-100">
                                        {booking?.route?.start_location} to {booking?.route?.end_location}
                                    </CardTitle>
                                    <Badge className={`${getStatusColor(booking.status)}`}>{booking.status}</Badge>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="hidden text-sm font-medium text-gray-500 lg:inline dark:text-gray-400">
                                        Ticket: {booking.ticket_code}
                                    </span>
                                    <div className="flex space-x-2">
                                        {/* Cancel Button */}
                                        {booking.status !== 'canceled' && ( // Only show if status is 'pending'
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 border-red-200 px-2 text-red-600 hover:bg-red-50
                                                           dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent card expansion
                                                    handleCancel(booking.id);
                                                }}
                                            >
                                                <Ban size={16} className="mr-1" />
                                                Cancel
                                            </Button>
                                        )}
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
                                    <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                    <span className="dark:text-gray-200">{formatDate(booking?.route?.date_and_time || '')}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                    <span className="dark:text-gray-200">
                                        {new Date(booking?.route?.date_and_time || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Users size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                    <span className="dark:text-gray-200">
                                        {booking.number_of_passengers} {booking.number_of_passengers === 1 ? 'Passenger' : 'Passengers'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                    <span className="flex items-center dark:text-gray-200">
                                        <span className="font-medium">{booking?.route?.start_location}</span>
                                        <span className="mx-2">→</span>
                                        <span className="font-medium">{booking?.route?.end_location}</span>
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </div>

                    {expandedBooking === booking.id && (
                        <CardFooter className="block border-t border-gray-100 bg-gray-50 p-4
                                                   dark:border-gray-700 dark:bg-gray-700">
                            <h4 className="mb-3 font-medium dark:text-gray-100">Passenger Information</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto text-left text-sm">
                                    <thead className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                                        <tr>
                                            <th className="px-4 py-2">Full Name</th>
                                            <th className="px-4 py-2">Age</th>
                                            <th className="px-4 py-2">Contact Number</th>
                                            <th className="px-4 py-2">Address</th>
                                            <th className="px-4 py-2">Fare</th>
                                            <th className="px-4 py-2">Fare Type</th>
                                            <th className="px-4 py-2">Residency</th>
                                            <th className="px-4 py-2">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                                        {booking?.passengers?.map((passenger, index) => (
                                            <tr key={index} className="dark:text-gray-200">
                                                <td className="px-4 py-2">{passenger.full_name}</td>
                                                <td className="px-4 py-2">{passenger.age}</td>
                                                <td className="px-4 py-2">{passenger.contact_number}</td>
                                                <td className="px-4 py-2">{passenger.address}</td>
                                                <td className="px-4 py-2">PHP {passenger.passenger_fare}</td>
                                                <td className="px-4 py-2">{passenger.passenger_fare_type}</td>
                                                <td className="px-4 py-2">{passenger.residency_status}</td>
                                                <td className="px-4 py-2">
                                                    <Badge className={`bg-blue-100 ${passenger.is_main_passenger ? 'text-blue-800' : 'text-green-800'}
                                                               dark:bg-blue-700 ${passenger.is_main_passenger ? 'dark:text-blue-100' : 'dark:text-green-100'}`}>
                                                        {passenger.is_main_passenger ? 'Main' : 'Additional'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default DisplayBookings;
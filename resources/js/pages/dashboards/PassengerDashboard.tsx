import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DashBoardProps } from '@/types';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Clock, Ticket } from 'lucide-react';

export default function PassengerDashboard({ bookings, nextTrip, upcomingTrips }: DashBoardProps) {
    return (
        <>
            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
                        <Ticket className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookings?.length}</div>
                        <p className="text-muted-foreground text-xs">Your Total Bookings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Next Trip</CardTitle>
                        <Clock className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        {nextTrip ? (
                            <>
                                <div className="text-2xl font-bold">
                                    {new Date(nextTrip.date_and_time).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    {new Date(nextTrip.date_and_time).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}{' '}
                                    – {nextTrip.start_location} to {nextTrip.end_location}
                                </p>
                            </>
                        ) : (
                            <p className="text-muted-foreground text-sm">No upcoming trip</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Schedule and Trips Section */}

            <Card className="p-5 py-10">
                <CardHeader>
                    <CardTitle>Available Trips</CardTitle>
                    <CardDescription>Book your next trip</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {upcomingTrips?.map((schedule) => (
                            <div key={schedule.id} className="flex flex-col justify-between gap-2 border-b pb-4 md:flex-row md:items-center">
                                <div>
                                    <p className="text-lg font-semibold">{schedule.name}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {format(new Date(schedule.date_and_time), 'MMMM d, yyyy - h:mm a')}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {schedule.start_location} ➜ {schedule.end_location}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground text-sm">
                                        Capacity: {schedule.capacity} | Occupied: {schedule.seats_occupied}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" size="sm">
                        <Link href={route('passenger.book_ticket')}>Book Ticket</Link>
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}

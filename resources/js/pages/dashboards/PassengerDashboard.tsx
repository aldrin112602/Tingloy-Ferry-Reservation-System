import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Ticket, Clock, AlertCircle } from 'lucide-react';

const upcomingSchedules = [
    { id: 1, route: 'Mabini to Tingloy', time: '9:00 AM', capacity: '45/50', date: '2025-04-23' },
    { id: 2, route: 'Tingloy to Mabini', time: '11:30 AM', capacity: '22/50', date: '2025-04-23' },
    { id: 3, route: 'Mabini to Tingloy', time: '2:00 PM', capacity: '18/50', date: '2025-04-23' },
];

const recentTrips = [
    { id: 1, route: 'Tingloy to Mabini', time: '9:00 AM', status: 'Completed', date: '2025-04-21' },
    { id: 2, route: 'Mabini to Tingloy', time: '11:30 AM', status: 'Boarding', date: '2025-04-22' },
    { id: 3, route: 'Tingloy to Mabini', time: '2:00 PM', status: 'Scheduled', date: '2025-04-22' },
];

export default function PassengerDashboard() {
    return (
        <>
            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">2 upcoming / 1 completed</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Next Trip</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">April 23</div>
                        <p className="text-xs text-muted-foreground">9:00 AM - Mabini to Tingloy</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Weather Alert</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">Clear Skies</div>
                        <p className="text-xs text-muted-foreground">All trips scheduled to run</p>
                    </CardContent>
                </Card>
            </div>

            {/* Schedule and Trips Section */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Schedule</CardTitle>
                        <CardDescription>Ferry trips for the next days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingSchedules.map(schedule => (
                                <div key={schedule.id} className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">{schedule.route}</p>
                                        <p className="text-sm text-muted-foreground">{schedule.time} - {schedule.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {schedule.capacity}
                                        </span>
                                        <Button size="sm">Book</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/schedule">View Full Schedule</Link>
                        </Button>
                    </CardFooter>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>My Recent Trips</CardTitle>
                        <CardDescription>Past and upcoming bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTrips.map(trip => (
                                <div key={trip.id} className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${
                                        trip.status === 'Completed' 
                                            ? 'bg-green-500' 
                                            : trip.status === 'Boarding' 
                                                ? 'bg-blue-500'
                                                : 'bg-gray-500'
                                    }`} />
                                    <div>
                                        <p className="text-sm">{trip.route}</p>
                                        <p className="text-xs text-muted-foreground">{trip.time} - {trip.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/bookings">View All Bookings</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Ship, Ticket, Users, Check, AlertCircle } from 'lucide-react';

const recentTrips = [
    { id: 1, route: 'Tingloy to Mabini', time: '9:00 AM', status: 'Completed', date: '2025-04-21' },
    { id: 2, route: 'Mabini to Tingloy', time: '11:30 AM', status: 'Boarding', date: '2025-04-22' },
    { id: 3, route: 'Tingloy to Mabini', time: '2:00 PM', status: 'Scheduled', date: '2025-04-22' },
];

export default function StaffDashboard() {
    return (
        <>
            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today's Passengers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87</div>
                        <p className="text-xs text-muted-foreground">56 boarded / 31 pending</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today's Trips</CardTitle>
                        <Ship className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">1 completed / 3 scheduled</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">QR Scans Today</CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">56</div>
                        <p className="text-xs text-muted-foreground">All valid</p>
                    </CardContent>
                </Card>
            </div>

            {/* Trip Schedule and Activity Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                        <CardDescription>Ferry trips for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTrips.map(trip => (
                                <div key={trip.id} className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">{trip.route}</p>
                                        <p className="text-sm text-muted-foreground">{trip.time} - {trip.date}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`rounded-full px-2 py-1 text-xs ${
                                            trip.status === 'Completed' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                : trip.status === 'Boarding' 
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}>
                                            {trip.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/staff/trip-schedules">View All Schedules</Link>
                        </Button>
                    </CardFooter>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>QR scans and validations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <div>
                                    <p className="text-sm">Ticket #12458 validated</p>
                                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <div>
                                    <p className="text-sm">Ticket #12457 validated</p>
                                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <div>
                                    <p className="text-sm">Invalid QR code scanned</p>
                                    <p className="text-xs text-muted-foreground">12 minutes ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/staff/scan">Scan QR Code</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
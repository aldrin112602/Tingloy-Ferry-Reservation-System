import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingProps, DashBoardProps } from '@/types';
import { BarChart2, Calendar, Ticket } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';

// Sample data for charts - replace with actual data fetching
const bookingData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 19 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 18 },
    { name: 'Fri', count: 27 },
    { name: 'Sat', count: 32 },
    { name: 'Sun', count: 24 },
];

const passengerData = [
    { name: 'Regular', value: 65 },
    { name: 'Senior', value: 15 },
    { name: 'Student', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AdminDashboard({ allBookings, passengers, upcomingTrips }: DashBoardProps) {
    
    return (
        <>
            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Ticket className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allBookings?.length || 0}</div>
                        <p className="text-muted-foreground text-xs">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled Trips</CardTitle>
                        <Calendar className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingTrips?.length}</div>
                        <p className="text-muted-foreground text-xs">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
                        <BarChart2 className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{passengers?.length}</div>
                        <p className="text-muted-foreground text-xs">This month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Tables Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Booking Trends</CardTitle>
                        <CardDescription>Weekly booking statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <BarChart width={550} height={300} data={bookingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Passenger Types</CardTitle>
                        <CardDescription>Breakdown by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-80 items-center justify-center">
                            <PieChart width={250} height={250}>
                                <Pie data={passengerData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                                    {passengerData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { DashBoardProps, type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BookA, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminDashboard from './dashboards/AdminDashboard';
import PassengerDashboard from './dashboards/PassengerDashboard';
import StaffDashboard from './dashboards/StaffDashboard';

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Calendar, Clock as ClockIcon, Ticket, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ bookings, nextTrip, upcomingTrips, allBookings, passengers }: DashBoardProps) {
    const { auth } = usePage<SharedData>().props;
    const { role } = auth.user;
    const isAdmin = role === 'admin';
    const isStaff = role === 'staff';
    const isPassenger = role === 'passenger';

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => {
            clearInterval(timer);
        };
    }, []);

    // Get quick action buttons based on user role
    const getQuickActionButtons = () => {
        if (isAdmin) {
            return (
                <>
                    <Button asChild className="justify-start">
                        <Link href={route('admin.schedule.index')}>
                            <Calendar className="mr-2 h-4 w-4" /> Manage Schedules
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                        <Link href={route('admin.bookings')}>
                            <BookA className="mr-2 h-4 w-4" /> Manage Bookings
                        </Link>
                    </Button>
                </>
            );
        } else if (isStaff) {
            return (
                <>
                    <Button asChild className="justify-start">
                        <Link href="/staff/scan">
                            <Ticket className="mr-2 h-4 w-4" /> Scan QR Code
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                        <Link href="/staff/boarded">
                            <Users className="mr-2 h-4 w-4" /> View Boarded Passengers
                        </Link>
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <Button asChild className="justify-start">
                        <Link href={route('passenger.book_ticket')}>
                            <Ticket className="mr-2 h-4 w-4" /> Book New Ticket
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                        <Link href={route('passenger.bookings')}>
                            <ClockIcon className="mr-2 h-4 w-4" /> View My Bookings
                        </Link>
                    </Button>
                </>
            );
        }
    };

    // Render the dashboard content based on user role
    const renderDashboardContent = ({ bookings, nextTrip, upcomingTrips, allBookings, passengers }: DashBoardProps) => {
        if (isAdmin) {
            return <AdminDashboard bookings={bookings} upcomingTrips={upcomingTrips} allBookings={allBookings} passengers={passengers} />;
        } else if (isStaff) {
            return <StaffDashboard />;
        } else if (isPassenger) {
            return <PassengerDashboard bookings={bookings} nextTrip={nextTrip} upcomingTrips={upcomingTrips} />;
        }
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Welcome Section and Quick Actions in a row */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Welcome Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back, {auth.user.name}</CardTitle>
                            <CardDescription>
                                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Clock size={20} />
                                <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">{getQuickActionButtons()}</CardContent>
                    </Card>
                </div>

                {/* Role-specific dashboard content */}
                {renderDashboardContent({ bookings, nextTrip, upcomingTrips, allBookings, passengers })}
            </div>
        </AppLayout>
    );
}

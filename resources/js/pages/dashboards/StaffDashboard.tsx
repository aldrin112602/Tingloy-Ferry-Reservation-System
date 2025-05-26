import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Users, Calendar, ScanLine, Check, AlertCircle } from 'lucide-react';
import { DashBoardProps } from '@/types';

const todayTrips = [
    { id: 1, route: 'Tingloy to Mabini', time: '9:00 AM', status: 'Completed', passengers: '238/240' },
    { id: 2, route: 'Mabini to Tingloy', time: '11:30 AM', status: 'Boarding', passengers: '156/240' },
    { id: 3, route: 'Tingloy to Mabini', time: '2:00 PM', status: 'Scheduled', passengers: '182/240' },
];

export default function StaffDashboard({ boardedCount, todaysTripCount, qrScannedCountToday }: DashBoardProps) {
    return (
        <>
            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{boardedCount}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today's Trips</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todaysTripCount}</div>
                        <p className="text-xs text-muted-foreground">Scheduled trips today</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
                        <ScanLine className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{qrScannedCountToday}</div>
                        <p className="text-xs text-muted-foreground">Total QR scanned today</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
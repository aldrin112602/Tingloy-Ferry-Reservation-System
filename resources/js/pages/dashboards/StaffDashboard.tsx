import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Users, Calendar, ScanLine } from 'lucide-react';
import { DashBoardProps } from '@/types';

export default function StaffDashboard({ boardedCount, todaysTripCount, qrScannedCountToday }: DashBoardProps) {
    return (
        <div className="space-y-8 p-6">
            {/* Header Gradient */}
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl p-8 text-white shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Welcome Back!</h1>
                        <p className="text-blue-100">Here's a quick overview of today's operations.</p>
                    </div>
                    <Link href={route('staff.scan_qr')} className='cursor-pointer'>
                        <Button className="bg-white text-blue-600 hover:bg-gray-100 transition-colors shadow-md cursor-pointer">
                            <ScanLine className="mr-2 h-5 w-5" />
                            Start Scanning
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Passengers */}
                <Card className="flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold">Total Passengers</CardTitle>
                        <Users className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-blue-700">{boardedCount}</div>
                        <p className="text-sm text-blue-500 mt-1">Boarded this month</p>
                    </CardContent>
                </Card>

                {/* Today's Trips */}
                <Card className="flex flex-col bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold">Today's Trips</CardTitle>
                        <Calendar className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-green-700">{todaysTripCount}</div>
                        <p className="text-sm text-green-500 mt-1">Scheduled for today</p>
                    </CardContent>
                </Card>

                {/* QR Scans Today */}
                <Card className="flex flex-col bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold">QR Scans Today</CardTitle>
                        <ScanLine className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-purple-700">{qrScannedCountToday}</div>
                        <p className="text-sm text-purple-500 mt-1">Bookings scanned</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

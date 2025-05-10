import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { FerrySchedulePaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Ship, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Passenger List',
        href: 'staff/passengers',
    },
];

const PassengerList = ({ paginatedResponseData }: { paginatedResponseData: FerrySchedulePaginatedResponse }) => {
    const formatScheduleDate = (dateString: string | number | Date) => {
        try {
            const date = new Date(dateString);
            return format(date, 'MMM d, yyyy • h:mm a');
        } catch (e) {
            return String(dateString);
        }
    };

    const calculateOccupancy = (occupied: number | undefined, capacity: number | undefined) => {
        return ((occupied ?? 0) / (capacity ?? 1)) * 100;
    };

    const getStatusColor = (status: string | undefined) => {
        switch ((status ?? '').toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Passenger List" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Ferry Schedules</h1>
                    <Button className="bg-blue-600 hover:bg-blue-700">Export Data</Button>
                </div>

                {paginatedResponseData.data.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedResponseData.data.map((route) => (
                            <Card key={route.id} className="overflow-hidden border-0 shadow-md transition-all hover:shadow-lg">
                                <div className="h-2 w-full bg-blue-600"></div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <Badge className={getStatusColor(route.status)}>
                                            {(route.status ?? '').charAt(0).toUpperCase() + (route.status ?? '').slice(1)}
                                        </Badge>
                                        <span className="text-sm font-medium text-gray-500">#{(route.route_code ?? '').split('-')[1]}</span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Ship className="h-5 w-5 text-blue-600" />
                                        {route.name}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <MapPin className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Route</div>
                                            <div className="text-md flex items-center gap-2">
                                                {route.start_location}
                                                <ChevronRight className="h-3 w-3" />
                                                {route.end_location}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <Calendar className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Schedule</div>
                                            <div className="text-md">{formatScheduleDate(route.date_and_time)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="w-full">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Occupancy</span>
                                                <span className="text-sm font-semibold">
                                                    {route.seats_occupied}/{route.capacity}
                                                </span>
                                            </div>
                                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{ width: `${calculateOccupancy(route.seats_occupied, route.capacity)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button className="w-full" variant="outline">
                                        View Passenger List
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-60 w-full items-center justify-center rounded-lg border border-dashed">
                        <div className="text-center">
                            <Ship className="mx-auto h-10 w-10 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium">No ferry schedules found</h3>
                            <p className="text-sm text-gray-500">There are no active ferry schedules at the moment.</p>
                        </div>
                    </div>
                )}

                {paginatedResponseData.data.length > 0 && paginatedResponseData.links && paginatedResponseData.links.length > 3 && (
                    <div className="mt-8 flex items-center justify-center gap-1">
                        {paginatedResponseData.links.map((link, i) => {
                            if ((link.label === '&laquo; Previous' || link.label === 'Next &raquo;') && link.url === null) {
                                return null;
                            }

                            if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                            link.url === null ? 'cursor-not-allowed text-gray-300' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {link.label === '&laquo; Previous' ? (
                                            <ChevronLeft className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url === null
                                              ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                                              : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default PassengerList;

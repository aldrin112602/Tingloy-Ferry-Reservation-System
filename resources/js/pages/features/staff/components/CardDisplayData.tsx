import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CardDisplayDataProps, Passenger } from '@/types';
import { format } from 'date-fns';
import { Calendar, ChevronRight, MapPin, Ship, Users } from 'lucide-react';

const CardDisplayData = ({ paginatedResponseData, setPassengersArr, setISOpenDialog }: CardDisplayDataProps) => {
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
        <>
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
                        <Button
                            onClick={() => {
                                setPassengersArr(route.passengers as Passenger[]);
                                setISOpenDialog(true);
                            }}
                            className="w-full"
                        >
                            View Passenger List
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};

export default CardDisplayData;

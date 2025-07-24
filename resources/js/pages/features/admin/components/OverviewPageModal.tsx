import { Passenger, RouteProps } from '@/types';
import { format } from 'date-fns';

export const OverviewPageModal = ({
    showOverview,
    setShowOverview,
    routeObj
}: {
    showOverview: boolean;
    setShowOverview: (curr: boolean) => void;
    routeObj?: RouteProps;
}) => {
    return (
        <>
            {showOverview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="w-full max-w-6xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900 dark:text-white transition-all">
                        <div className="flex items-center justify-between border-b pb-4 mb-6">
                            <h2 className="text-2xl font-bold">Trip Overview</h2>
                            <button
                                onClick={() => setShowOverview(false)}
                                className="text-lg hover:text-red-500"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
                            <p><strong>Route:</strong> {routeObj?.name} ({routeObj?.route_code})</p>
                            <p><strong>From:</strong> {routeObj?.start_location}</p>
                            <p><strong>To:</strong> {routeObj?.end_location}</p>
                            <p><strong>Date:</strong> {routeObj ? format(new Date(routeObj?.date_and_time), 'PPP') : ''}</p>
                            <p><strong>Time:</strong> {routeObj ? format(new Date(routeObj?.date_and_time), 'p') : ''}</p>
                            <p><strong>Status:</strong> <span className={`font-semibold ${routeObj?.status === 'finished' ? 'text-green-600' : 'text-yellow-600'}`}>{routeObj?.status.toUpperCase()}</span></p>
                            <p><strong>Capacity:</strong> {routeObj?.capacity}</p>
                            <p><strong>Seats Occupied:</strong> {routeObj?.seats_occupied}</p>
                            <p><strong>Remaining Seats:</strong> {routeObj ? (routeObj.capacity - routeObj.seats_occupied) : 0}</p>
                        </div>

                        {routeObj?.passengers && routeObj.passengers.length > 0 ? (
                            <>
                                <h3 className="mt-8 text-xl font-semibold border-b pb-2">Passenger List ({routeObj.passengers.length})</h3>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full table-auto border-collapse">
                                        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
                                            <tr>
                                                <th className="px-4 py-2">Full Name</th>
                                                <th className="px-4 py-2">Age</th>
                                                <th className="px-4 py-2">Contact</th>
                                                <th className="px-4 py-2">Address</th>
                                                <th className="px-4 py-2">Fare</th>
                                                <th className="px-4 py-2">Type</th>
                                                <th className="px-4 py-2">Residency</th>
                                                <th className="px-4 py-2">Main Passenger</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {routeObj.passengers.map((passenger: Passenger) => (
                                                <tr key={passenger.id} className="border-t dark:border-gray-700">
                                                    <td className="px-4 py-2">{passenger.full_name}</td>
                                                    <td className="px-4 py-2">{passenger.age}</td>
                                                    <td className="px-4 py-2">{passenger.contact_number}</td>
                                                    <td className="px-4 py-2">{passenger.address}</td>
                                                    <td className="px-4 py-2">₱{passenger.passenger_fare}</td>
                                                    <td className="px-4 py-2">{passenger.passenger_fare_type}</td>
                                                    <td className="px-4 py-2 capitalize">{passenger.residency_status}</td>
                                                    <td className="px-4 py-2">{passenger.is_main_passenger ? '✅' : '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <p className="mt-6 text-gray-500 dark:text-gray-400">No passengers booked yet.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

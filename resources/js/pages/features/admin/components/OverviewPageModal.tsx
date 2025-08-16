import { Passenger, RouteProps } from '@/types';
import { format } from 'date-fns';
import { handlePrintOverview } from './handlePrintOverview';
import { X, Printer } from 'lucide-react';

export const OverviewPageModal = ({
    showOverview,
    setShowOverview,
    routeObj,
}: {
    showOverview: boolean;
    setShowOverview: (curr: boolean) => void;
    routeObj?: RouteProps;
}) => {
    if (!showOverview) return null;
    console.log(routeObj)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-6xl rounded-2xl bg-white dark:bg-gray-900 dark:text-white shadow-2xl transition-all overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-2xl font-semibold">🚢 Trip Overview</h2>
                    <button
                        onClick={() => setShowOverview(false)}
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition"
                    >
                        <X className="w-5 h-5 text-red-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Print Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => handlePrintOverview(routeObj)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md transition"
                        >
                            <Printer className="w-4 h-4" /> Print Overview
                        </button>
                    </div>

                    {/* Trip Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm">
                            <p><strong>Route:</strong> {routeObj?.name} ({routeObj?.route_code})</p>
                            <p><strong>From:</strong> {routeObj?.start_location}</p>
                            <p><strong>To:</strong> {routeObj?.end_location}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm">
                            <p><strong>Date:</strong> {routeObj ? format(new Date(routeObj?.date_and_time), 'PPP') : ''}</p>
                            <p><strong>Time:</strong> {routeObj ? format(new Date(routeObj?.date_and_time), 'p') : ''}</p>
                            <p>
                                <strong>Status:</strong>{' '}
                                <span
                                    className={`font-semibold ${routeObj?.status === 'finished'
                                            ? 'text-green-600'
                                            : 'text-yellow-600'
                                        }`}
                                >
                                    {routeObj?.status.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm flex items-center justify-between">
                        <p className='border border-white block w-full text-center py-4'><strong>Capacity:</strong> {routeObj?.capacity}</p>
                        <p className='border border-white block w-full text-center py-4'><strong>Seats Occupied:</strong> {routeObj?.seats_occupied}</p>
                        <p className='border border-white block w-full text-center py-4'>
                            <strong>Remaining:</strong>{' '}
                            {routeObj ? routeObj.capacity - routeObj.seats_occupied : 0}
                        </p>
                    </div>


                    {/* Passengers */}
                    {routeObj?.passengers && routeObj.passengers.length > 0 ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                👥 Passengers ({routeObj.passengers.length})
                            </h3>
                            <div className="overflow-x-auto rounded-lg shadow">
                                <table className="min-w-full border-collapse">
                                    <thead className="bg-gray-200 dark:bg-gray-700 text-left sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2">Full Name</th>
                                            <th className="px-4 py-2">Age</th>
                                            <th className="px-4 py-2">Contact</th>
                                            <th className="px-4 py-2">Address</th>
                                            <th className="px-4 py-2">Fare</th>
                                            <th className="px-4 py-2">Type</th>
                                            <th className="px-4 py-2">Residency</th>
                                            <th className="px-4 py-2">Main</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routeObj.passengers.map((p: Passenger) => (
                                            <tr
                                                key={p.id}
                                                className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                            >
                                                <td className="px-4 py-2">{p.full_name}</td>
                                                <td className="px-4 py-2">{p.age}</td>
                                                <td className="px-4 py-2">{p.contact_number}</td>
                                                <td className="px-4 py-2">{p.address}</td>
                                                <td className="px-4 py-2">₱{p.passenger_fare}</td>
                                                <td className="px-4 py-2">{p.passenger_fare_type}</td>
                                                <td className="px-4 py-2 capitalize">{p.residency_status}</td>
                                                <td className="px-4 py-2 text-center">
                                                    {p.is_main_passenger ? '✅' : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No passengers booked yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

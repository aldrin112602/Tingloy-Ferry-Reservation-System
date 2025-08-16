import { RouteProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

const ScheduleAndRoutes = ({ routes }: { routes: RouteProps[] }) => {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
    });

    return (
        <>
            <Head title="Available Routes & Schedules">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=outfit:300,400,500,600,700|plus-jakarta-sans:300,400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="mx-auto p-6">
                {/* Page Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Available Routes & Schedules
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Browse through the available ferry schedules and book your trip.
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        As of <span className="font-semibold">{today}</span>
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Route Code</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">From</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">To</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Occupied</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Schedule</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {routes.map((route) => (
                                <tr key={route.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{route.route_code}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{route.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{route.start_location}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{route.end_location}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-gray-200">{route.capacity}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-gray-200">{route.seats_occupied}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-gray-200">
                                        {new Date(route.date_and_time).toLocaleString("en-PH", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                            timeZone: "Asia/Manila",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Link
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                                            href={'register'}
                                        >
                                            Book Now
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ScheduleAndRoutes;

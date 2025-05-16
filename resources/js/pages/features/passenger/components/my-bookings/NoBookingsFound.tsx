import { Calendar } from "lucide-react";

const NoBookingsFound = () => {
    return (
        <div className="rounded-lg bg-gray-50 p-10 text-center">
            <div className="mb-4 text-gray-400">
                <Calendar size={48} className="mx-auto" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-700">No Bookings Found</h3>
            <p className="text-gray-500">You don't have any bookings yet.</p>
        </div>
    );
};

export default NoBookingsFound;

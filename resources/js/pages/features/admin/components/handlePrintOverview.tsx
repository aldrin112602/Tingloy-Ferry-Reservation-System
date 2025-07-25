import { RouteProps, Passenger } from '@/types';
import { format } from 'date-fns';

export const handlePrintOverview = (routeObj?: RouteProps) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow && !routeObj) return;

    const passengersHtml = routeObj && routeObj.passengers && Array.isArray(routeObj.passengers) ? routeObj.passengers.map((passenger: Passenger) => `
        <tr>
            <td>${passenger.full_name}</td>
            <td>${passenger.age}</td>
            <td>${passenger.contact_number}</td>
            <td>${passenger.address}</td>
            <td>${passenger.passenger_fare_type} - ₱${passenger.passenger_fare}</td>
            <td>${passenger.residency_status}</td>
        </tr>
    `).join('') : '';

    const htmlContent = `
        <html>
        <head>
            <title>Trip Overview</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1, h2 { margin-bottom: 0.5rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f8f8f8; }
                .info p { margin: 4px 0; }
            </style>
        </head>
        <body>
            <h1>Trip Overview</h1>
            <div class="info">
                <p><strong>Route:</strong> ${routeObj?.name} (${routeObj?.route_code})</p>
                <p><strong>From:</strong> ${routeObj?.start_location}</p>
                <p><strong>To:</strong> ${routeObj?.end_location}</p>
                <p><strong>Date:</strong> ${routeObj?.date_and_time ? format(new Date(routeObj.date_and_time), 'PPP') : 'N/A'}</p>
                <p><strong>Time:</strong> ${routeObj?.date_and_time ? format(new Date(routeObj.date_and_time), 'p') : 'N/A'}</p>
                <p><strong>Capacity:</strong> ${routeObj?.capacity}</p>
                <p><strong>Seats Occupied:</strong> ${routeObj?.seats_occupied}</p>
                <p><strong>Remaining Seats:</strong> ${typeof routeObj?.capacity === 'number' && typeof routeObj?.seats_occupied === 'number'
            ? routeObj.capacity - routeObj.seats_occupied
            : 'N/A'
        }</p>
            </div>

            <h2>Passengers</h2>
            ${(routeObj?.passengers && Array.isArray(routeObj.passengers) && routeObj.passengers.length > 0) ? `
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Age</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Fare</th>
                            <th>Residency</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${passengersHtml}
                    </tbody>
                </table>
            ` : `<p>No passengers booked yet.</p>`}
            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;

    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
};

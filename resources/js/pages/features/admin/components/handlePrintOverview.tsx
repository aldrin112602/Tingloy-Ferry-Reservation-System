import { RouteProps, Passenger } from '@/types';
import { format } from 'date-fns';

export const handlePrintOverview = (routeObj?: RouteProps) => {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');

    if (!printWindow || !routeObj) return;

    const host = `${window.location.protocol}//${window.location.host}`;
    const now = format(new Date(), "MMM dd, yyyy hh:mm a");

    // Passengers Table
    const passengersHtml = Array.isArray(routeObj.passengers) ? routeObj.passengers.map((p: Passenger, idx: number) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${p.full_name}</td>
            <td>${p.age}</td>
            <td>${p.contact_number}</td>
            <td>${p.address}</td>
            <td>${p.passenger_fare_type} – ₱${p.passenger_fare}</td>
            <td>${p.residency_status}</td>
            <td>${p.is_main_passenger ? 'Yes' : 'No'}</td>
            <td>${p.id_file ? `<img src="${host}/storage/${p.id_file}" width="80" />` : 'N/A'}</td>
        </tr>
    `).join('') : '';

    // Bookings Table (with QR)
    const bookingsHtml = Array.isArray(routeObj.bookings) ? routeObj.bookings.map((b: any, idx: number) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${b.ticket_code}</td>
            <td>${b.payment_method}</td>
            <td>₱${b.total_fee}</td>
            <td>${b.is_paid ? 'Paid' : 'Unpaid'}</td>
            <td>${b.number_of_passengers}</td>
            <td>${b.status}</td>
            <td>${b.receipt_image ? `<img src="${host}/storage/${b.receipt_image}" width="100" />` : 'N/A'}</td>
            <td>${b.qr_code ? `<img src="https://quickchart.io/qr?text=${b.qr_code}&size=200" width="100" />` : 'N/A'}</td>
        </tr>
    `).join('') : '';

    const htmlContent = `
        <html>
        <head>
            <title>Trip Overview</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                h1, h2 { margin-bottom: 0.5rem; }
                h1 { font-size: 24px; border-bottom: 3px solid #222; padding-bottom: 6px; }
                h2 { margin-top: 2rem; font-size: 18px; color: #222; border-bottom: 1px solid #aaa; padding-bottom: 4px; }
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 14px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: middle; }
                th { background-color: #f2f2f2; }
                img { border: 1px solid #aaa; border-radius: 4px; padding: 2px; }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .company-info { text-align: left; }
                .company-info h1 { margin: 0; font-size: 20px; }
                .company-info p { margin: 2px 0; font-size: 12px; color: #555; }
                .print-date { font-size: 12px; color: #666; text-align: right; }
                .summary-box { display: flex; gap: 40px; margin-top: 10px; }
                .summary-box div { flex: 1; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company-info">
                    <h1>🚢 Tingloy Ferry</h1>
                    <p>Official Trip Manifest</p>
                    <p>Generated: ${now}</p>
                </div>
                <div class="print-date">
                    <p><strong>Route Code:</strong> ${routeObj.route_code}</p>
                    <p><strong>Status:</strong> ${routeObj.status.toUpperCase()}</p>
                </div>
            </div>

            <div class="info">
                <p><strong>Route:</strong> ${routeObj.name}</p>
                <div class="summary-box">
                    <div>
                        <p><strong>From:</strong> ${routeObj.start_location}</p>
                        <p><strong>To:</strong> ${routeObj.end_location}</p>
                    </div>
                    <div>
                        <p><strong>Date:</strong> ${routeObj.date_and_time ? format(new Date(routeObj.date_and_time), 'MMM dd, yyyy') : 'N/A'}</p>
                        <p><strong>Time:</strong> ${routeObj.date_and_time ? format(new Date(routeObj.date_and_time), 'hh:mm a') : 'N/A'}</p>
                    </div>
                    <div>
                        <p><strong>Capacity:</strong> ${routeObj.capacity}</p>
                        <p><strong>Seats Occupied:</strong> ${routeObj.seats_occupied}</p>
                        <p><strong>Remaining:</strong> ${routeObj.capacity - routeObj.seats_occupied}</p>
                    </div>
                </div>
            </div>

            <h2>Passenger List (${routeObj.passengers?.length || 0})</h2>
            ${passengersHtml ? `
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Age</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Fare</th>
                            <th>Residency</th>
                            <th>Main Passenger</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${passengersHtml}
                    </tbody>
                </table>
            ` : `<p>No passengers found.</p>`}

            <h2>Bookings (${routeObj.bookings?.length || 0})</h2>
            ${bookingsHtml ? `
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ticket Code</th>
                            <th>Payment</th>
                            <th>Total Fee</th>
                            <th>Paid</th>
                            <th>Passengers</th>
                            <th>Status</th>
                            <th>Receipt</th>
                            <th>QR</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookingsHtml}
                    </tbody>
                </table>
            ` : `<p>No bookings found.</p>`}

            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 600);
                };
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

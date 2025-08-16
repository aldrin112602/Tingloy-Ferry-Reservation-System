import { Link, Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Ticket, Users, CreditCard } from "lucide-react";

export default function LearnMore() {
  return (
    <>
      <Head title="Learn More About Tingloy Ferry Reservation System">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=outfit:300,400,500,600,700|plus-jakarta-sans:300,400,500,600,700" rel="stylesheet" />
      </Head>
      <div className="w-full">
        <section className="bg-blue-900 text-white py-20 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Learn More About Tingloy Ferry</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Discover how our ferry reservation system makes traveling simple, secure,
            and stress-free from booking to boarding.
          </p>
        </section>

        <section className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Online Booking</h3>
                <p>
                  Reserve tickets easily for yourself or groups. Access real-time
                  seat availability with multiple payment options.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Ticket className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">QR Code Ticketing</h3>
                <p>
                  Secure, one-time use QR tickets that prevent duplication and ensure
                  authenticity with digital record keeping.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Quick Verification</h3>
                <p>
                  Faster boarding with QR code scanning, automated passenger tracking,
                  and enhanced security.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">1. Create Your Account</h3>
                <p className="text-gray-600 dark:text-gray-300">Sign up or log in to access all features.</p>
              </CardContent>
            </Card>

            <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">2. Select Your Route</h3>
                <p className="text-gray-600 dark:text-gray-300">Choose your ferry route, date, and preferred time.</p>
              </CardContent>
            </Card>

            <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">3. Book & Pay</h3>
                <p className="text-gray-600 dark:text-gray-300">Enter passenger details and complete payment.</p>
              </CardContent>
            </Card>

            <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">4. Scan & Board</h3>
                <p className="text-gray-600 dark:text-gray-300">Present your QR code for quick scanning when boarding.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-6 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">System Highlights</h2>
          <ul className="grid md:grid-cols-2 gap-6 text-lg">
            <li className="flex items-start gap-3">
              <CreditCard className="w-6 h-6 text-blue-600 mt-1" />
              Multiple payment options for online or cash transactions
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-6 h-6 text-blue-600 mt-1" />
              Group booking for families or large groups
            </li>
            <li className="flex items-start gap-3">
              <Ticket className="w-6 h-6 text-blue-600 mt-1" />
              One-time use QR codes for secure verification
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
              Automated passenger tracking for safety
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="bg-blue-900 text-white text-center py-20 px-6">
          <h2 className="text-3xl font-bold mb-6">Ready for a Better Ferry Experience?</h2>
          <p className="mb-8 max-w-xl mx-auto">
            Join thousands of travelers who already simplified their journey with Tingloy Ferry’s reservation system.
          </p>
          <div className="flex justify-center">
            <Link href={route('register')} className="bg-white text-blue-900 font-semibold hover:bg-gray-100 px-7 py-3 rounded-2xl">
              Get Started
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

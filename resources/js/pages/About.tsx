import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Logo from '../images/logo.png';

function About() {
    const { auth } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="About Us - Tingloy Ferry Reservation" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 dark:text-white">

                <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
                    <div className="max-w-4xl py-12">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                            About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tingloy Ferry</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Welcome to the Tingloy Ferry Reservation System, your trusted partner for seamless travel between Mabini and Tingloy. Our mission is to simplify your journey with our advanced online booking, secure QR ticketing, and efficient boarding process. We are committed to providing a reliable and safe travel experience for every passenger.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}

export default About;
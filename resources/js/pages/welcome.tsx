import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Logo from '../images/logo.png';
import { useForm } from '@inertiajs/react'
import Swal from 'sweetalert2';


export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state for the contact form
    const form = useForm({
        name: '',
        email: '',
        message: '',
    });

    const openModal = (e: any) => {
        // Prevent the default link behavior
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        form.post(route('contact.submit'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success',
                    text: 'Your message has been sent successfully!',
                    icon: 'success'
                });
                
                form.reset();
                closeModal();
            },
            onError: (errors) => {
                console.error('Submission failed:', errors);
                alert('Failed to send message. Please try again.');
            }
        });
    };

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

    // Also, handle closing the modal with the Escape key
    useEffect(() => {
        const handleEscape = (e: any) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen]);

    return (
        <>
            <Head title="Welcome to Tingloy Ferry Reservation">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=outfit:300,400,500,600,700|plus-jakarta-sans:300,400,500,600,700" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 dark:text-white">
                {/* Decorative elements */}
                <div className="fixed -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-20 blur-3xl dark:from-blue-600 dark:to-blue-700"></div>
                <div className="fixed -right-20 -bottom-20 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-200 to-pink-200 opacity-20 blur-3xl dark:from-purple-700 dark:to-pink-700"></div>

                {/* Navigation */}
                <header
                    className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/70 shadow-sm backdrop-blur-lg dark:bg-gray-900/70' : 'bg-transparent'}`}
                >
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="h-12 w-12 rounded-xl">
                                {/* logo */}
                                <img src={Logo} alt="Tingloy Logo" className='w-full object-cover' />
                            </div>
                            <span className="text-xl tracking-tight font-normal" style={{ fontFamily: '"Arvo", serif' }}>Tingloy Ferry</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-medium">
                            <Link
                                href={route('about')}
                                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ABOUT
                            </Link>
                            <Link
                                href={route('routes')}
                                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ROUTES
                            </Link>
                            <button
                                onClick={openModal}
                                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                                CONTACT
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-full px-6 py-2 text-sm font-medium backdrop-blur-lg transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/10"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Main and other sections here... */}
                <main className="flex min-h-screen flex-col">
                    {/* Hero Section */}
                    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-20">
                        <div className="relative mx-auto max-w-7xl">
                            <div className="absolute top-1/4 -right-4 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20 blur-3xl dark:from-blue-700 dark:to-purple-700"></div>
                            <div className="absolute bottom-1/4 -left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400 opacity-20 blur-3xl dark:from-indigo-700 dark:to-pink-700"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-1.5 text-sm font-medium text-blue-600 dark:from-blue-500/20 dark:to-indigo-500/20 dark:text-blue-400">
                                    <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                                    Now available Mabini to Tingloy (Vise Versa)
                                </span>

                                <h1 className="mb-6 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-5xl font-bold tracking-tight text-transparent  lg:text-6xl dark:from-white dark:to-blue-100">
                                    Tingloy Ferry Reservation <br />
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Made Simple</span>
                                </h1>

                                <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                    Experience seamless travel with our cutting-edge reservation system featuring secure QR ticketing, instant
                                    verification, and hassle-free boarding.
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <Link
                                        href={route('register')}
                                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-base font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                                    >
                                        <span className="relative z-10">Book Your Ferry Now</span>
                                        <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"></span>
                                    </Link>
                                    {/* Learn More link, now opens in a new tab as requested */}
                                    <Link
                                        href={route('learn_more')}
                                        className="rounded-full border border-gray-300 bg-white/30 px-8 py-3 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/50 dark:border-gray-700 dark:bg-white/5 dark:hover:bg-white/10"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Features Section */}
                    <section id="features" className="mt-16 px-6 py-16">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-16 text-center">
                                <span className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                                    Key Features
                                </span>
                                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Simplifying Your Ferry Travel</h2>
                                <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                                    Our reservation system transforms your travel experience with these powerful features
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {/* Feature Card 1 */}
                                <div className="group relative rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur-lg transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/70">
                                    <div className="absolute top-6 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-100 dark:from-blue-500/20 dark:to-indigo-500/20"></div>

                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 text-white shadow-lg shadow-blue-500/30">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-8 w-8"
                                        >
                                            <rect width="18" height="18" x="3" y="3" rx="2" />
                                            <path d="M7 7h10" />
                                            <path d="M7 12h10" />
                                            <path d="M7 17h10" />
                                        </svg>
                                    </div>

                                    <h3 className="mb-3 text-xl font-semibold">Online Booking</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Reserve ferry tickets with ease by providing your personal details and travel information. Perfect for
                                        individual or group bookings.
                                    </p>

                                    <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-blue-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Multiple payment options
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-blue-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Group booking capabilities
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-blue-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Real-time seat availability
                                        </li>
                                    </ul>
                                </div>

                                {/* Feature Card 2 */}
                                <div className="group relative rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur-lg transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/70">
                                    <div className="absolute top-6 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-100 dark:from-purple-500/20 dark:to-pink-500/20"></div>

                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-3 text-white shadow-lg shadow-purple-500/30">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-8 w-8"
                                        >
                                            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                                            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                                            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                                            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                                            <rect width="7" height="7" x="7" y="7" rx="1" />
                                            <rect width="7" height="7" x="10" y="10" rx="1" />
                                        </svg>
                                    </div>

                                    <h3 className="mb-3 text-xl font-semibold">QR Code Ticketing</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Receive secure QR code tickets that ensure authenticity, prevent duplication, and protect against ticket
                                        fraud.
                                    </p>

                                    <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-purple-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            One-time use verification
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-purple-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Advanced encryption
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-purple-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Digital record keeping
                                        </li>
                                    </ul>
                                </div>

                                {/* Feature Card 3 */}
                                <div className="group relative rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur-lg transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/70">
                                    <div className="absolute top-6 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-teal-500/10 to-emerald-500/10 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-100 dark:from-teal-500/20 dark:to-emerald-500/20"></div>

                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-3 text-white shadow-lg shadow-teal-500/30">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-8 w-8"
                                        >
                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <path d="m9 15 2 2 4-4" />
                                        </svg>
                                    </div>

                                    <h3 className="mb-3 text-xl font-semibold">Quick Verification</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Enjoy streamlined boarding with our QR code scanning system for efficient ticket verification and passenger
                                        tracking.
                                    </p>

                                    <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-teal-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Faster boarding process
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-teal-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Automated passenger tracking
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 text-teal-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Enhanced travel security
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="px-6 py-16">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-16 text-center">
                                <span className="mb-2 inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                                    Simple Process
                                </span>
                                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
                                <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                                    From booking to boarding, experience a seamless journey with our streamlined process
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg dark:border-gray-800 dark:from-gray-900/80 dark:to-blue-950/80">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                        <h3 className="text-xl font-semibold">For Passengers</h3>
                                    </div>
                                    <div className="p-6">
                                        <ol className="relative ml-6 border-l border-gray-300 dark:border-gray-700">
                                            <li className="mb-8 ml-6">
                                                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm text-white">
                                                    1
                                                </span>
                                                <h4 className="mb-1 text-lg font-semibold">Create Your Account</h4>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Sign up or log in to access all reservation features
                                                </p>
                                            </li>
                                            <li className="mb-8 ml-6">
                                                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm text-white">
                                                    2
                                                </span>
                                                <h4 className="mb-1 text-lg font-semibold">Select Your Route</h4>
                                                <p className="text-gray-600 dark:text-gray-300">Choose your ferry route, date, and preferred time</p>
                                            </li>
                                            <li className="mb-8 ml-6">
                                                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm text-white">
                                                    3
                                                </span>
                                                <h4 className="mb-1 text-lg font-semibold">Book & Pay</h4>
                                                <p className="text-gray-600 dark:text-gray-300">Enter passenger details and complete payment</p>
                                            </li>
                                            <li className="ml-6">
                                                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm text-white">
                                                    4
                                                </span>
                                                <h4 className="mb-1 text-lg font-semibold">Scan & Board</h4>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Present your QR code for quick scanning when boarding
                                                </p>
                                            </li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-lg dark:border-gray-800 dark:from-gray-900/80 dark:to-purple-950/80">
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                                        <h3 className="text-xl font-semibold">System Highlights</h3>
                                    </div>
                                    <div className="p-6">
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="m5 12 5 5L20 7"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">Multiple Payment Options</h4>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Choose from online transactions or cash payments at our terminals
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="m5 12 5 5L20 7"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">Group Booking</h4>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Reserve multiple tickets in a single transaction for family or group travel
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="m5 12 5 5L20 7"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">One-Time Use QR Codes</h4>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Secure ticket verification that prevents duplication and fraud
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="m5 12 5 5L20 7"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">Passenger Tracking</h4>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Enhanced safety with automated boarding records and passenger manifests
                                                    </p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call To Action */}
                    <section className="px-6 py-16">
                        <div className="mx-auto max-w-7xl">
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-2xl md:p-12">
                                <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
                                <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>

                                <div className="relative z-10 flex flex-col items-center md:flex-row md:justify-between">
                                    <div className="mb-8 max-w-xl text-center md:mb-0 md:text-left">
                                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready for a Better Ferry Experience?</h2>
                                        <p className="text-blue-100 md:text-lg">
                                            Join thousands of travelers who have already simplified their journey with our reservation system.
                                        </p>
                                    </div>
                                    <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row">
                                        <Link
                                            href={route('register')}
                                            className="group relative overflow-hidden rounded-full bg-white px-8 py-3 text-center font-medium text-blue-600 shadow-lg transition-all duration-300 hover:shadow-xl"
                                        >
                                            <span className="relative z-10">Get Started</span>
                                            <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"></span>
                                        </Link>
                                        {/* Learn More link, now opens in a new tab as requested */}
                                        <Link
                                            href={route('learn_more')}
                                            className="rounded-full border border-white/30 bg-white/10 px-8 py-3 text-center font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="px-6 py-12 text-center">
                    <div className="mx-auto max-w-7xl border-t border-gray-200 pt-8 dark:border-gray-800">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex items-center gap-2">
                                <div className="h-12 w-12 rounded-xl">
                                    <img src={Logo} alt="Tingloy Logo" className='w-full object-cover' />
                                </div>
                                <span className="text-lg font-medium">Tingloy Ferry</span>
                            </div>
                            <nav className="flex flex-wrap justify-center gap-6 text-sm">
                                <Link href={route('about')} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                    About
                                </Link>

                                <Link href={route('routes')} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                    Routes
                                </Link>

                                <button onClick={openModal} className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                    Contact
                                </button>
                                {/* Terms and Privacy links were removed as per request */}
                            </nav>
                        </div>
                        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} Tingloy Ferry Reservation System. All rights reserved.
                        </p>
                    </div>
                </footer>

                {/* The Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-start pointer-events-none">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0  shadow-lg transition-opacity duration-300 ease-in-out pointer-events-auto"
                            onClick={closeModal}
                        ></div>
                        
                        {/* Modal container with transition effect from bottom-left */}
                        <div
                            className={`relative w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl dark:shadow-[0_4px_6px_rgba(255,255,255,0.3)]  transform transition-all duration-500 ease-in-out pointer-events-auto
                                ${isModalOpen
                                    ? 'translate-x-0 translate-y-0 opacity-100'
                                    : '-translate-x-full translate-y-full opacity-0'
                                }
                                mb-6 ml-6`}
                        >
                            <div className="flex items-center justify-between border-b pb-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-3"
                                    />
                                    {form.errors.name && <div className="text-red-500 text-xs mt-1">{form.errors.name}</div>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white  px-4 py-3"
                                    />
                                    {form.errors.email && <div className="text-red-500 text-xs mt-1">{form.errors.email}</div>}
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        value={form.data.message}
                                        onChange={(e) => form.setData('message', e.target.value)}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white  px-4 py-3"
                                    ></textarea>
                                    {form.errors.message && <div className="text-red-500 text-xs mt-1">{form.errors.message}</div>}
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                                    >
                                        {form.processing ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
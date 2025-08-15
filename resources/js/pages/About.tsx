import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Logo from '../images/logo.png';

export default function About() {
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

                {/* Navigation - Same as Welcome page */}
                <header
                    className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/70 shadow-sm backdrop-blur-lg dark:bg-gray-900/70' : 'bg-transparent'}`}
                >
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="h-12 w-12 rounded-xl">
                                <img src={Logo} alt="Tingloy Logo" className='w-full object-cover'/>
                            </div>
                            <span className="text-xl tracking-tight font-normal" style={{ fontFamily: '"Arvo", serif' }}>Tingloy Ferry</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-medium">
                            <Link href={route('about')} className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer">ABOUT</Link>
                            <Link href={route('routes')} className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer">ROUTES</Link>
                            <Link href={route('contact')} className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">CONTACT</Link>
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
                                    <Link href={route('login')} className="rounded-full px-6 py-2 text-sm font-medium backdrop-blur-lg transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/10">Log in</Link>
                                    <Link href={route('register')} className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">Register</Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

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

                {/* Footer - Same as Welcome page */}
                <footer className="px-6 py-12 text-center">
                    <div className="mx-auto max-w-7xl border-t border-gray-200 pt-8 dark:border-gray-800">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 shadow-lg">
                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12h12V8z"></path>
                                        <path d="M6 2h12v6H6z"></path>
                                        <path d="M9 10h1"></path>
                                        <path d="M14 10h1"></path>
                                        <path d="M9 14h6"></path>
                                    </svg>
                                </div>
                                <span className="text-lg font-medium">Tingloy Ferry</span>
                            </div>
                            <nav className="flex flex-wrap justify-center gap-6 text-sm">
                                <Link href={route('about')} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">About</Link>
                                <Link href={route('routes')} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Routes</Link>
                                <Link href={route('contact')} className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Contact</Link>
                            </nav>
                        </div>
                        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} Tingloy Ferry Reservation System. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
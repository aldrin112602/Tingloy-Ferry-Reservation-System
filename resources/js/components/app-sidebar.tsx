import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart2, BookOpen, Calendar, Compass, CreditCard, LayoutGrid, ScanLine, Settings2, Ship, Ticket, UserCog, Users } from 'lucide-react';
import AppLogo from './app-logo';

// Passenger menu
const passengerNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Book Ticket', href: '/book-ticket', icon: Ticket },
    { title: 'Ferry Schedule', href: '/schedule', icon: Calendar },
    { title: 'My Bookings', href: '/bookings', icon: BookOpen },
    { title: 'Payment Options', href: '/payment-options', icon: CreditCard },
    { title: 'Account Settings', href: '/settings', icon: Settings2 },
];

// Staff (Verifier) menu
const staffNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Scan QR Code', href: '/staff/scan', icon: ScanLine },
    { title: 'Boarded Passengers', href: '/staff/boarded', icon: Users },
    { title: 'Trip Schedules', href: '/staff/trip-schedules', icon: Compass },
    { title: 'Account Settings', href: '/settings', icon: Settings2 },
];

// Admin menu
const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Manage Ferries', href: '/admin/ferries', icon: Ship },
    { title: 'Schedules', href: '/admin/schedules', icon: Calendar },
    { title: 'User Management', href: '/admin/users', icon: UserCog },
    { title: 'Ticket Management', href: '/admin/tickets', icon: Ticket },
    { title: 'QR Validation Logs', href: '/admin/qr-logs', icon: ScanLine },
    { title: 'Payment Settings', href: '/admin/payments', icon: CreditCard },
    { title: 'Reports & Analytics', href: '/admin/reports', icon: BarChart2 },
    { title: 'System Settings', href: '/admin/system-settings', icon: Settings2 },
    { title: 'Account Settings', href: '/settings', icon: Settings2 },
];

// Optional: footer nav items
const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { role } = auth.user;

    let mainNavItems: NavItem[] = [];

    switch (role) {
        case 'admin':
            mainNavItems = adminNavItems;
            break;
        case 'staff':
            mainNavItems = staffNavItems;
            break;
        case 'passenger':
            mainNavItems = passengerNavItems;
            break;
        default:
            mainNavItems = [];
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

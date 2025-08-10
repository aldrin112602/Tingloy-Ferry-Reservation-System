import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, PhilippinePeso, CogIcon, BookOpen, Calendar, LayoutGrid, ScanLine, Settings2, Ticket, UserCog, Users } from 'lucide-react';
import AppLogo from './app-logo';

// Passenger menu
const passengerNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Book Ticket', href: '/passenger/book_ticket', icon: Ticket },
    { title: 'My Bookings', href: '/passenger/bookings', icon: BookOpen },
    { title: 'Notifications', href: '/passenger/notifications', icon: Bell },
    { title: 'Account Settings', href: '/settings', icon: Settings2 },
];

// Staff (Verifier) menu
const staffNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Scan QR', href: '/staff/scan_qr', icon: ScanLine },
    { title: 'Passenger List', href: '/staff/passengers', icon: Users },
    { title: 'Notifications', href: '/staff/notifications', icon: Bell },
    { title: 'Account Settings', href: '/settings', icon: Settings2 },
];

// Admin menu
const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Manage Schedule', href: '/admin/schedule', icon: Calendar },
    { title: 'Manage Bookings', href: '/admin/bookings', icon: BookOpen },
    { title: 'Manage Accounts', href: '/admin/accounts_management', icon: UserCog },
    { title: 'Setup Payment', href: '/admin/setup_payments', icon:  PhilippinePeso },
    { title: 'Setup Fare Types', href: '/admin/setup_fare_types', icon:  CogIcon },
    { title: 'Notifications', href: '/admin/notifications', icon: Bell },
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

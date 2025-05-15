import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role?: string;
    [key: string]: unknown;
}

export interface RouteProps {
    id: number;
    name: string;
    route_code: string;
    start_location: string;
    end_location: string;
    date_and_time: string;
    capacity: number;
    seats_occupied: number;
    status: string;
    [key: string]: unknown;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface FerrySchedulePaginatedResponse {
    current_page: number;
    data: RouteProps[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    passengers?: Passenger[];
}

export interface BookingProps {
    id: number;
    user_id: number;
    route_id: number;
    ticket_code: string;
    number_of_passengers: number;
    status: string;
    passengers?: Passenger[];
    route?: RouteProps;
}

export type MyBookingsProps = {
    bookings: BookingProps[];
    [key: string]: unknown;
};

export interface AddRouteFormData {
    name: string;
    route: string;
    date_and_time: string;
    [key: string]: string;
}

export interface AddNewScheduleProps {
    dialogRefStore: React.RefObject<HTMLDialogElement | null>;
    closeAddRouteModal: () => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    data: { name: string; route: string; date_and_time: string };
    errors: { name?: string; route?: string; date_and_time?: string };
    setData: (field: string, value: string) => void;
    processing: boolean;
}

export interface EditRouteFormData {
    id: number;
    name: string;
    start_location: string;
    end_location: string;
    date_and_time: string;
    [key: string]: string | number;
}

export interface EditScheduleProps {
    dialogRefEdit: React.RefObject<HTMLDialogElement | null>;
    routeObj: RouteProps;
}

export interface RouteItemProps {
    route: RouteProps;
    onDelete?: () => void;
    openEditDialog: (route: RouteProps) => void;
}

export interface Ferry {
    id: number;
    date_and_time: string;
    start_location: string;
    end_location: string;
    capacity: number;
    seats_occupied: number;
}

export interface Schedule {
    id: number;
    route: string;
    time: string;
    date: string;
    available: number;
}

export interface Passenger {
    id: number;
    full_name: string;
    age: string;
    address: string;
    contact_number: string;
    residency_status: string;
    is_main_passenger: boolean;
}

export interface ViewPassengersProps {
    isOpenDialog: boolean;
    setISOpenDialog: (value: boolean) => void;
    passengersArr: Passenger[];
}

export interface BookingRowProps {
    booking: BookingProps;
}

export interface ManageBookingsProps extends User {
    booking: BookingProps[];
}

export interface BookingTableProps {
    users: ManageBookingsProps[];
    expandedUser: number | null;
    toggleUserExpand: (userId: number) => void;
}

export interface EmptyStateProps {
    message: string;
}

export interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
}

export interface UserBookingsProps {
    bookings: BookingProps[];
}


export interface ManageBookingsProps extends User {
    booking: BookingProps[];
}

export interface UserRowProps {
    user: ManageBookingsProps;
    isExpanded: boolean;
    toggleExpand: () => void;
}
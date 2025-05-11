<?php

use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\StaffController;
use App\Models\Route as RouteSchedule;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');




    // STAFF ROUTES
    Route::prefix('staff')->group(function () {
        Route::get('passengers', [StaffController::class, 'passengerList'])->name('staff.passengers');
        Route::get('scan_qr', [StaffController::class, 'scanQrCode'])->name('staff.scan_qr');
    });




    // PASSENGER ROUTES
    Route::prefix('passenger')->group(function () {
        Route::get('book_ticket', function () {
            $routes = RouteSchedule::latest()->get();
            
            return Inertia::render('features/passenger/BookTicket', ['routes' => $routes]);
        })->name('passenger.book_ticket');

        Route::get('bookings', [BookingController::class, 'index'])->name('passenger.bookings');

        Route::get('routes', [RouteController::class, 'index'])->name('passenger.routes');
        Route::post('book', [BookingController::class, 'store'])->name('bookings.store');
    });


    // ADMIN ROUTES
    Route::prefix('admin')->group(function () {
        Route::get('schedule', function () {
            $paginatedResponseData = RouteSchedule::latest()->paginate(10);
            return Inertia::render('features/admin/ManageSchedule', ['paginatedResponseData' => $paginatedResponseData]);
        })->name('admin.schedule.index');
        Route::post('schedule', [RouteController::class, 'store'])->name('admin.schedule.store');
        Route::put('schedule', [RouteController::class, 'put'])->name('admin.schedule.put');
        Route::delete('schedule/{id}', [RouteController::class, 'delete'])->name('admin.schedule.delete');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';


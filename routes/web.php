<?php

use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\StaffController;
use App\Models\Route as RouteSchedule;
use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\QrController;
use App\Http\Controllers\DashBoardController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashBoardController::class, 'index'])->name('dashboard');

    // STAFF ROUTES
    Route::prefix('staff')->middleware('role:staff')->group(function () {
        Route::get('passengers', [StaffController::class, 'passengerList'])->name('staff.passengers');
        Route::get('scan_qr', [StaffController::class, 'scanQrCode'])->name('staff.scan_qr');
        Route::post('qr_validation', [QrController::class, 'validate'])->name('qr.validation');
        Route::post('booking/{id}', [QrController::class, 'bookingPaid'])->name('booking.paid');

    });

    // PASSENGER ROUTES
    Route::prefix('passenger')->middleware('role:passenger')->group(function () {
        Route::get('book_ticket', function () {
            $routes = RouteSchedule::latest()->get();
            return Inertia::render('features/passenger/BookTicket', ['routes' => $routes]);
        })->name('passenger.book_ticket');

        Route::get('bookings', [BookingController::class, 'index'])->name('passenger.bookings');
        Route::post('book', [BookingController::class, 'store'])->name('bookings.store');

        
    });

    // ADMIN ROUTES
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('schedule', [RouteController::class, 'index'])->name('admin.schedule.index');
        Route::post('schedule', [RouteController::class, 'store'])->name('admin.schedule.store');
        Route::put('schedule', [RouteController::class, 'put'])->name('admin.schedule.put');
        Route::delete('schedule/{id}', [RouteController::class, 'delete'])->name('admin.schedule.delete');


        Route::prefix('bookings')->group(function () {
            Route::get('/', [AdminBookingController::class, 'index'])->name('admin.bookings');
            Route::get('details/{id}', [AdminBookingController::class, 'show'])->name('admin.bookings.show');
            Route::post('approve/{id}', [AdminBookingController::class, 'approve'])->name('admin.bookings.approve');
            Route::post('reject/{id}', [AdminBookingController::class, 'reject'])->name('admin.bookings.reject');
        });


        
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

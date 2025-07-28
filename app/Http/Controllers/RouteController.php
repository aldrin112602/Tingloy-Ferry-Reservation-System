<?php

namespace App\Http\Controllers;

use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class RouteController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();
        $now = now()->timezone('Asia/Manila');



        // Auto-update past trips
        Route::where('status', '!=', 'finished')
            ->where('date_and_time', '<', $now)
            ->update([
                'status' => 'finished',
            ]);

        $status = $request->get('status');

        $query = Route::with('passengers', 'bookings');

        if ($status) {
            $query->where('status', $status);
        }

        $paginatedResponseData = $query->orderBy('date_and_time', 'asc')
            ->paginate(20)
            ->appends($request->query());

        return Inertia::render('features/admin/ManageSchedule', [
            'paginatedResponseData' => $paginatedResponseData,
            'currentStatus' => $status,
        ]);
    }



    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'route' => 'required|string',
            'date_and_time' => 'required|string',
        ]);

        $split_route = explode(' ', $request->route);


        $start_location = $split_route[0];
        $end_location = $split_route[2];


        $route = Route::create(
            [
                'name' => $request->name,
                'start_location' => $start_location,
                'end_location' => $end_location,
                'date_and_time' => $request->date_and_time,
            ]
        );

        return redirect()->route('admin.schedule.index')
            ->with('success', 'Route created successfully!');
    }

    public function put(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'start_location' => 'required|string',
            'end_location' => 'required|string',
            'date_and_time' => 'required|string',
            'status' => [
                'required',
                'string',
                Rule::in(['scheduled', 'departed', 'in_transit', 'arrived', 'cancelled', 'finished']),
            ],
        ]);

        $route = Route::findOrFail($request->id);
        if (!$route) {
            return redirect()->route('admin.schedule.index')
                ->with('error', 'Route not found!');
        }


        $route->update(
            [
                'name' => $request->name,
                'start_location' => $request->start_location,
                'end_location' => $request->end_location,
                'date_and_time' => $request->date_and_time,
                'status' => $request->status,
            ]
        );

        return redirect()->route('admin.schedule.index')
            ->with('success', 'Route updated successfully!');
    }

    public function delete($id)
    {
        $route = Route::findOrFail($id);
        $route->delete();

        return redirect()->route('admin.schedule.index')
            ->with('success', 'Route deleted successfully!');
    }
}

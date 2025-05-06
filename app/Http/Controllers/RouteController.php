<?php

namespace App\Http\Controllers;

use App\Models\Route;
use Illuminate\Http\Request;


class RouteController extends Controller
{
    public function index()
    {
        $routes = Route::all();
        return response()->json($routes, 200);
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
}

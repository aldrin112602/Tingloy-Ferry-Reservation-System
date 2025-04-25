<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\Route;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index(): JsonResponse
    {
        $routes = Route::all();
        return response()->json($routes, 200);
    }

    public function store(Request $request): JsonResponse
    {
        
        $request->validate([
            'name' => 'nullable|string',
            'start_location' => 'nullable|string',
            'end_location' => 'nullable|string',
            'route_code' => 'nullable|string',
            'seats_occupied' => 'nullable|integer',
            'date_and_time' => 'nullable|string',
            'status' => 'nullable|string',
        ]);


        $route = Route::create(
            [
                'name' => $request->name,
                'start_location' => $request->start_location,
                'end_location' => $request->end_location,
                'route_code' => $request->route_code,
                'seats_occupied' => $request->seats_occupied,
                'date_and_time' => $request->date_and_time,
                'status' => $request->status
            ]
            );

        return response()->json([
            'message' => 'Route created successfully',
            'route' => $route
        ], 201);

    }
} 

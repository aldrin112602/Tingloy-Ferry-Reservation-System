<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FareType;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SetupFareTypeController extends Controller
{
    public function index()
    {
        $fareTypes = FareType::paginate(10);
        return Inertia::render('features/admin/SetupFareTypes', [
            'fareTypes' => $fareTypes,
        ]);
    }

    public function getFareTypes()
    {
        $fareTypes = FareType::all();
        return response()->json($fareTypes, 200);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'required_valid_id' => 'required|boolean',
            ]);

            $fareType = FareType::create($validatedData);

            return response()->json([
                'message' => 'Fare type created successfully.',
                'data' => $fareType,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating the fare type.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'required_valid_id' => 'required|boolean'
            ]);

            $fareType = FareType::findOrFail($id);
            $fareType->update($validatedData);

            return response()->json([
                'message' => 'Fare type updated successfully.',
                'data' => $fareType,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Fare type not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the fare type.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $fareType = FareType::findOrFail($id);
            $fareType->delete();

            return response()->json([
                'message' => 'Fare type deleted successfully.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Fare type not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while deleting the fare type.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
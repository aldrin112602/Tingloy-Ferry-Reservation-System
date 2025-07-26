<?php

namespace App\Http\Controllers;

use App\Models\SetupPayment;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;

class SetupPaymentController extends Controller
{
    public function index()
    {
        $SetupPayments = SetupPayment::paginate(10);
        return Inertia::render('features/admin/SetupPayments', [
            'SetupPayments' => $SetupPayments,
        ]);
    }

    public function getSetupPayments()
    {
        $SetupPayments = SetupPayment::all();
        return response()->json($SetupPayments, 200);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'payment_method_name' => 'required|string|max:255',
                'account_name' => 'required|string|max:255',
                'account_number' => 'required|string|max:255',
            ]);

            $payment = SetupPayment::create($validatedData);

            return response()->json([
                'message' => 'Setup payment created successfully.',
                'data' => $payment,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating the setup payment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'payment_method_name' => 'required|string|max:255',
                'account_name' => 'required|string|max:255',
                'account_number' => 'required|string|max:255',
            ]);

            $setupPayment = SetupPayment::findOrFail($id);
            $setupPayment->update($validatedData);

            return response()->json([
                'message' => 'Setup payment updated successfully.',
                'data' => $setupPayment,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Setup payment not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the setup payment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $setupPayment = SetupPayment::findOrFail($id);
            $setupPayment->delete();

            return response()->json([
                'message' => 'Setup payment deleted successfully.',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Setup payment not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while deleting the setup payment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

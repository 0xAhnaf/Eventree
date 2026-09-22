<?php

namespace App\Http\Controllers;

use App\Models\VendorBooking;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function show(Request $request, $eventId)
    {
        $customerId = $request->user()->id;

        $bookings = VendorBooking::with([
            'vendorProfile',
            'vendorPackage',
        ])
        ->where('event_id', $eventId)
        ->where('customer_id', $customerId)
        ->where('status', 'accepted')
        ->get();

        if ($bookings->isEmpty()) {
            return response()->json([
                'message' => 'No accepted vendor bookings found for this event.'
            ], 404);
        }

        $subtotal = $bookings->sum('package_price');

        $items = $bookings->map(function ($booking) {
            return [
                'vendor_name' => $booking->vendorProfile->business_name ?? 'Unknown Vendor',
                'package_name' => $booking->package_name,
                'package_price' => $booking->package_price,
                'status' => $booking->status,
            ];
        });

        return response()->json([
            'event_id' => $eventId,
            'customer' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
            ],
            'items' => $items,
            'subtotal' => $subtotal,
        ]);
    }

    public function download(Request $request, $eventId)
    {
        $customerId = $request->user()->id;

        $bookings = VendorBooking::with([
            'vendorProfile',
            'vendorPackage',
        ])
        ->where('event_id', $eventId)
        ->where('customer_id', $customerId)
        ->where('status', 'accepted')
        ->get();

        if ($bookings->isEmpty()) {
            return response()->json([
                'message' => 'No accepted vendor bookings found for this event.'
            ], 404);
        }

        $items = $bookings->map(function ($booking) {
            return [
                'vendor_name' => $booking->vendorProfile->business_name ?? 'Unknown Vendor',
                'package_name' => $booking->package_name,
                'package_price' => $booking->package_price,
                'status' => $booking->status,
            ];
        });

        $subtotal = $bookings->sum('package_price');

        $pdf = Pdf::loadView('invoices.event-invoice', [
            'event_id' => $eventId,
            'customer' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
            ],
            'items' => $items,
            'subtotal' => $subtotal,
        ]);

        return $pdf->download('eventree-invoice-' . $eventId . '.pdf');
    }
}
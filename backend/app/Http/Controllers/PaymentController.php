<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Razorpay\Api\Api;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private function api(): Api {
        return new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
    }

    public function createRazorpayOrder(Request $r) {
        try {
            $u = $r->user();
            if (!$u) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
            
            $base   = (int) env('PRO_PRICE_PAISE', 29900);
            $pct    = (float) env('CONVENIENCE_FEE_PCT', 0.03);
            $minFee = (int) env('CONVENIENCE_FEE_MIN_PAISE', 500);
            $fee    = max((int) round($base * $pct), $minFee);
            $amount = $base + $fee;

            $order = $this->api()->order->create([
                'amount'   => $amount,
                'currency' => 'INR',
                'receipt'  => 'rcpt_'.time().'_u'.$u->id,
                'notes'    => ['user_id'=>$u->id, 'type'=>'pro_upgrade', 'base'=>$base, 'fee'=>$fee],
            ]);

            // Store payment record
            try {
                Payment::create([
                    'user_id'  => $u->id,
                    'order_id' => $order['id'],
                    'amount'   => $amount,
                    'currency' => 'INR',
                    'status'   => 'created',
                    'notes'    => json_encode(['base'=>$base, 'fee'=>$fee]),
                ]);
            } catch (\Exception $e) {
                Log::warning('Could not save payment record', ['error' => $e->getMessage()]);
                // Continue anyway - we can still process the payment
            }

            return [
                'key'      => env('RAZORPAY_KEY_ID'),
                'order_id' => $order['id'],
                'amount'   => $amount,
                'currency' => 'INR',
                'user'     => ['name'=>$u->name, 'email'=>$u->email],
            ];
        } catch (\Throwable $e) {
            Log::error('Razorpay create order failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $r->user()->id ?? null
            ]);
            $errorMsg = $e->getMessage();
            // Make error more user-friendly
            if (str_contains($errorMsg, 'Authentication failed')) {
                $errorMsg = 'Razorpay API authentication failed. Please check your API keys.';
            } elseif (str_contains($errorMsg, 'network') || str_contains($errorMsg, 'timeout')) {
                $errorMsg = 'Unable to connect to payment gateway. Please try again.';
            }
            return response()->json(['error' => $errorMsg], 400);
        }
    }

    public function verifyRazorpay(Request $r) {
        try {
            $data = $r->validate([
                'razorpay_order_id'   => 'required|string',
                'razorpay_payment_id' => 'required|string',
                'razorpay_signature'  => 'required|string',
            ]);

            $p = Payment::where('order_id', $data['razorpay_order_id'])->first();

            $expected = hash_hmac(
                'sha256',
                $data['razorpay_order_id'].'|'.$data['razorpay_payment_id'],
                env('RAZORPAY_KEY_SECRET')
            );

            if (!hash_equals($expected, $data['razorpay_signature'])) {
                if ($p) {
                    $p->update([
                        'status' => 'failed',
                        'payment_id' => $data['razorpay_payment_id'],
                        'signature'  => $data['razorpay_signature'],
                    ]);
                }
                return response()->json(['error'=>'Signature verification failed'], 400);
            }

            // Update payment record if exists
            if ($p) {
                $p->update([
                    'status' => 'paid',
                    'payment_id' => $data['razorpay_payment_id'],
                    'signature'  => $data['razorpay_signature'],
                ]);
                $u = $p->user;
            } else {
                $u = $r->user();
            }
            
            $u->plan = 'pro';
            $u->save();

            return ['ok'=>true, 'plan'=>$u->plan];
        } catch (\Throwable $e) {
            Log::error('Razorpay verify failed', ['ex' => $e->getMessage()]);
            return response()->json(['error' => 'Razorpay verify error: '.$e->getMessage()], 400);
        }
    }
}

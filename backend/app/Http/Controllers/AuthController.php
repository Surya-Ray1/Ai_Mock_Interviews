<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller {
public function register(Request $r){
$data = $r->validate([
'name'=>'required|string|max:255',
'email'=>'required|email|unique:users',
'password'=>'required|string|min:6'
]);
$user = User::create([
'name'=>$data['name'], 'email'=>$data['email'], 'password'=>Hash::make($data['password'])
]);
$token = $user->createToken('api')->plainTextToken; // Sanctum token
return response()->json(['token'=>$token,'user'=>$user], 201);
}
public function login(Request $r){
$r->validate(['email'=>'required|email','password'=>'required']);
$user = User::where('email',$r->email)->first();
if(!$user || !Hash::check($r->password, $user->password)){
return response()->json(['message'=>'Invalid credentials'], 422);
}
$token = $user->createToken('api')->plainTextToken;
return ['token'=>$token,'user'=>$user];
}
public function me(Request $r){ return $r->user(); }
public function logout(Request $r){ $r->user()->currentAccessToken()->delete(); return ['ok'=>true]; }
}
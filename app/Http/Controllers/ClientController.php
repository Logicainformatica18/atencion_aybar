<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client; // Asegúrate de importar el modelo Client
class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
public function searchByName(Request $request)
{
    $q = $request->input('q');

    return Client::where('DNI', 'like', "%$q%")
        ->orWhere('Razon_Social', 'like', "%$q%")
        ->limit(10)
        ->get(['id_cliente as id', 'DNI as dni', 'Razon_Social as names']);
}


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

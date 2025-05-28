<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'clientes'; // nombre de la tabla
    protected $primaryKey = 'id_cliente'; // clave primaria
    public $timestamps = false; // la tabla no tiene created_at ni updated_at

    protected $fillable = [
        'id_slin',
        'Codigo',
        'Razon_Social',
        'T.Doc.',
        'DNI',
        'NIT',
        'Direccion',
        'Ubigeo',
        'Departamento',
        'Provincia',
        'Distrito',
        'Telefono',
        'Email',
        'id_rol',
        'clave',
        'c_clave',
        'ref_telefono1',
        'ref_telefono2',
        'comentario',
        'canal',
        'habilitado',
    ];


}

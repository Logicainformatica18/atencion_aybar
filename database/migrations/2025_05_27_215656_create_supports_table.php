<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
     Schema::create('supports', function (Blueprint $table) {
        $table->engine = 'InnoDB';
    $table->charset = 'latin1';
    $table->collation = 'latin1_swedish_ci';
        $table->id();

    // Datos del cliente
    $table->string('subject'); // Motivo resumido o título de la solicitud
    $table->text('description')->nullable(); // Detalles adicionales

    // Nuevos campos sugeridos
    $table->string('priority')->default('Normal'); // Normal, Urgente, Preferencial
    $table->string('type')->default('Consulta'); // Consulta, Reclamo, etc.
    $table->string('attachment')->nullable(); // Archivo opcional

    // Relación con área (opcional)
    $table->integer('area_id')->nullable();
    $table->foreign('area_id')->references('id_area')->on('areas');

    // Relación con quien creó el ticket
    $table->bigInteger('created_by')->unsigned();
    $table->foreign('created_by')->references('id')->on('users');

    // Relación con cliente
$table->integer('client_id'); // compatible con INT(11)

$table->foreign('client_id')->references('id_cliente')->on('clientes');

    // Estado del soporte
    $table->enum('status', ['Pendiente', 'Atendido', 'Cerrado'])->default('Pendiente');

    // Nuevos campos de control de tiempo
    $table->dateTime('reservation_time')->nullable(); // Hora de ingreso a la cola
    $table->dateTime('attended_at')->nullable(); // Hora en que fue atendido
    $table->string('derived')->nullable(); // Hora en que se cerró el ticket
    $table->string('cellphone')->nullable(); // Hora en que se cerró el ticket
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supports');
    }
};

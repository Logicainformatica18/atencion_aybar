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
            $table->string('subject');
            $table->text('description')->nullable();
            $table->string('priority')->default('Normal');
            $table->string('type')->default('Consulta');
            $table->string('attachment')->nullable();

            // Relaciones existentes
            $table->integer('area_id')->nullable();
            $table->foreign('area_id')->references('id_area')->on('areas');

            $table->bigInteger('created_by')->unsigned();
            $table->foreign('created_by')->references('id')->on('users');

            $table->integer('client_id');
            $table->foreign('client_id')->references('id_cliente')->on('clientes');

            // Estado del soporte
            $table->enum('status', ['Pendiente', 'Atendido', 'Cerrado'])->default('Pendiente');

            // Nuevos campos de control de tiempo
            $table->dateTime('reservation_time')->nullable();
            $table->dateTime('attended_at')->nullable();
            $table->string('derived')->nullable();
            $table->string('cellphone')->nullable();

            // Relaciones adicionales solicitadas
            $table->integer('id_motivos_cita')->nullable();
            $table->foreign('id_motivos_cita')->references('id_motivos_cita')->on('motivos_cita');

            $table->integer('id_tipo_cita')->nullable();
            $table->foreign('id_tipo_cita')->references('id_tipo_cita')->on('tipos_cita');

            $table->integer('id_dia_espera')->nullable();
            $table->foreign('id_dia_espera')->references('id_dias_espera')->on('dias_espera');

            $table->unsignedBigInteger('internal_state_id')->nullable();
            $table->foreign('internal_state_id')->references('id')->on('internal_states');

            $table->unsignedBigInteger('external_state_id')->nullable();
            $table->foreign('external_state_id')->references('id')->on('external_states');
            
            $table->unsignedBigInteger('type_id')->nullable();
            $table->foreign('type_id')->references('id')->on('types');

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

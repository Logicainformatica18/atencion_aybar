<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('supports', function (Blueprint $table) {
            $table->integer('project_id');
            $table->foreign('project_id')->references('id_proyecto')->on('proyecto')->onDelete('cascade');
            $table->string('Manzana')->nullable();
            $table->string('Lote')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('supports', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropColumn('project_id');
            $table->dropColumn('Manzana');
            $table->dropColumn('Lote');
        });
    }
};

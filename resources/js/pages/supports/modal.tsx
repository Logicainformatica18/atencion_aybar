// resources/js/pages/supports/SupportModal.tsx

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SupportModal({
  open,
  onClose,
  onSaved,
  supportToEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (support: any) => void;
  supportToEdit?: any;
}) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'Normal',
    type: 'Consulta',
    status: 'Pendiente',
    cellphone: '',
    created_by: 1, // Deberías reemplazar con el ID del usuario autenticado
    client_id: 1,   // O elegir desde un dropdown si se quiere
    area_id: null,
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (supportToEdit) {
      setFormData({
        subject: supportToEdit.subject || '',
        description: supportToEdit.description || '',
        priority: supportToEdit.priority || 'Normal',
        type: supportToEdit.type || 'Consulta',
        status: supportToEdit.status || 'Pendiente',
        cellphone: supportToEdit.cellphone || '',
        created_by: supportToEdit.created_by || 1,
        client_id: supportToEdit.client_id || 1,
        area_id: supportToEdit.area_id || null,
      });
      if (supportToEdit.attachment) {
        setPreview(`/attachments/${supportToEdit.attachment}`);
      }
    } else {
      handleReset();
    }
  }, [supportToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFile(file);
      setPreview(file.type.startsWith('image') ? URL.createObjectURL(file) : file.name);
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setProgress(0);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, String(value));
      });
      if (file) data.append('attachment', file);

      const url = supportToEdit ? `/supports/${supportToEdit.id}` : '/supports';
      if (supportToEdit) data.append('_method', 'PUT');

      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      toast.success(supportToEdit ? 'Soporte actualizado ✅' : 'Soporte creado ✅');
      onSaved(response.data.support);
      handleReset();
      onClose();
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      toast.error('Hubo un error al guardar');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFormData({
      subject: '',
      description: '',
      priority: 'Normal',
      type: 'Consulta',
      status: 'Pendiente',
      cellphone: '',
      created_by: 1,
      client_id: 1,
      area_id: null,
    });
    setFile(null);
    setPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{supportToEdit ? 'Editar Soporte' : 'Nuevo Soporte'}</DialogTitle>
        </DialogHeader>

        {uploading && (
          <div className="w-full mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2 bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-center text-gray-500 mt-1">{progress}%</p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">Asunto</Label>
            <Input name="subject" value={formData.subject} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">Descripción</Label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="col-span-3 border rounded px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Prioridad</Label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="col-span-3 border rounded px-3 py-2 text-sm">
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
              <option value="Preferencial">Preferencial</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Tipo</Label>
            <select name="type" value={formData.type} onChange={handleChange} className="col-span-3 border rounded px-3 py-2 text-sm">
              <option value="Consulta">Consulta</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Sugerencia">Sugerencia</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Estado</Label>
            <select name="status" value={formData.status} onChange={handleChange} className="col-span-3 border rounded px-3 py-2 text-sm">
              <option value="Pendiente">Pendiente</option>
              <option value="Atendido">Atendido</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cellphone" className="text-right">Celular</Label>
            <Input name="cellphone" value={formData.cellphone} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attachment" className="text-right">Archivo</Label>
            <div className="col-span-3">
              <Input type="file" name="attachment" onChange={handleFileChange} />
              {preview && (
                <div className="mt-2">
                  {preview.startsWith('blob:') ? (
                    <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <a href={preview} className="text-blue-600 underline text-sm">{preview}</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={uploading}>Nuevo</Button>
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {supportToEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose} disabled={uploading}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

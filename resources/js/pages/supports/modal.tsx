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
import ClientSearch from './clientSearch';

const getNowPlusHours = (plus = 0) => {
    const now = new Date();
    now.setHours(now.getHours() + plus);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const MM = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

export default function SupportModal({
    open,
    onClose,
    onSaved,
    supportToEdit,
    motives,
    appointmentTypes,
    waitingDays,
    internalStates,
    externalStates,
    types,
}: {
    open: boolean;
    onClose: () => void;
    onSaved: (support: any) => void;
    supportToEdit?: any;
    motives: any[];
    appointmentTypes: any[];
    waitingDays: any[];
    internalStates: any[];
    externalStates: any[];
    types: any[];
}) {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'Normal',
        type: 'Consulta',
        status: 'Pendiente',
        cellphone: '',
        created_by: 1,
        client_id: 1,
        area_id: '',
        reservation_time: getNowPlusHours(0),
        attended_at: getNowPlusHours(1),
        derived: '',
        id_motivos_cita: '',
        id_tipo_cita: '',
        id_dia_espera: '',
        internal_state_id: '',
        external_state_id: '',
        type_id: '',
    });

    const [clientQuery, setClientQuery] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        axios.get('/areas/all')
            .then((res) => setAreas(res.data))
            .catch((err) => console.error('Error al cargar áreas:', err));

        if (supportToEdit) {
            setFormData({
                ...formData,
                ...supportToEdit,
                reservation_time: supportToEdit.reservation_time || getNowPlusHours(0),
                attended_at: supportToEdit.attended_at || getNowPlusHours(1)
            });
            setClientQuery(supportToEdit.client?.names || '');
            if (supportToEdit.attachment) {
                setPreview(`/attachments/${supportToEdit.attachment}`);
            }
        }
    }, [supportToEdit]);

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
        if (selected) {
            setPreview(selected.type.startsWith('image') ? URL.createObjectURL(selected) : selected.name);
        }
    };

    const handleSubmit = async () => {
        try {
            setUploading(true);
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) data.append(key, String(value));
            });
            if (file) data.append('attachment', file);

            const url = supportToEdit ? `/supports/${supportToEdit.id}` : '/supports';
            if (supportToEdit) data.append('_method', 'PUT');

            const response = await axios.post(url, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success(supportToEdit ? 'Soporte actualizado ✅' : 'Soporte creado ✅');
            onSaved(response.data.support);
            onClose();
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            toast.error('Hubo un error al guardar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{supportToEdit ? 'Editar Atención' : 'Nueva Atención'}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Asunto</Label>
                    <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="col-span-3"
                    />
                </div>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Cliente</Label>
                        <ClientSearch
                            query={clientQuery}
                            setQuery={setClientQuery}
                            onSelect={(client) => {
                                setFormData((prev) => ({ ...prev, client_id: client.id }));
                                setClientQuery(client.names);
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Descripción</Label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="col-span-3 border rounded px-3 py-2 text-sm"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Área</Label>
                        <select name="area_id" value={formData.area_id} onChange={handleChange} className="col-span-3">
                            <option value="">Seleccione...</option>
                            {areas.map((a) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Archivo</Label>
                        <input type="file" onChange={handleFileChange} className="col-span-3" />
                        {preview && preview.startsWith('blob:') && (
                            <img src={preview} alt="preview" className="col-span-3 w-20 h-20 object-cover rounded" />
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Motivo de Cita</Label>
                        <select name="id_motivos_cita" value={formData.id_motivos_cita} onChange={handleChange} className="col-span-3">
                            <option value="">Seleccione...</option>
                            {motives.map(m => <option key={m.id} value={m.id}>{m.nombre_motivo}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Tipo de Cita</Label>
                        <select name="id_tipo_cita" value={formData.id_tipo_cita} onChange={handleChange} className="col-span-3">
                            <option value="">Seleccione...</option>
                            {appointmentTypes.map(t => <option key={t.id} value={t.id}>{t.tipo}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Día de Espera</Label>
                        <select name="id_dia_espera" value={formData.id_dia_espera} onChange={handleChange} className="col-span-3">
                            <option value="">Seleccione...</option>
                            {waitingDays.map(d => <option key={d.id} value={d.id}>{d.dias}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Estado Interno</Label>
                        <select name="internal_state_id" value={formData.internal_state_id} onChange={handleChange} className="col-span-3">
                            <option value="">Seleccione...</option>
                            {internalStates.map(i => <option key={i.id} value={i.id}>{i.description}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Estado Externo</Label>
                        <select name="external_state_id" value={formData.external_state_id} onChange={handleChange} className="col-span-3">
                            <option value="">Seleccione...</option>
                            {externalStates.map(e => <option key={e.id} value={e.id}>{e.description}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Tipo (Catálogo)</Label>
                        <select name="type_id" value={formData.type_id} onChange={handleChange} className="col-span-3">
                            <option value="">Seleccione...</option>
                            {types.map(t => <option key={t.id} value={t.id}>{t.description}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Reserva</Label>
                        <Input type="datetime-local" name="reservation_time" value={formData.reservation_time} onChange={handleChange} className="col-span-3" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Atendido</Label>
                        <Input type="datetime-local" name="attended_at" value={formData.attended_at} onChange={handleChange} className="col-span-3" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Derivado</Label>
                        <Input name="derived" value={formData.derived} onChange={handleChange} className="col-span-3" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Celular</Label>
                        <Input name="cellphone" value={formData.cellphone} onChange={handleChange} className="col-span-3" />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={uploading}>Cerrar</Button>
                    <Button onClick={handleSubmit} disabled={uploading}>
                        {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SupportModal from './modal';
import SupportTable from './table';
import ChatWidget from '@/components/ChatWidget';
import Echo from 'laravel-echo';

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
  wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  forceTLS: false,
  enabledTransports: ['ws'],
});

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Atenciones', href: '/supports' },
];

type Support = {
  id: number;
  subject: string;
  description?: string;
  priority: string;
  type: string;
  status: string;
  attachment?: string;
  reservation_time?: string;
  attended_at?: string;
  derived?: string;
  cellphone?: string;
  created_at?: string;
  updated_at?: string;
  area_id?: number;
  created_by?: number;
  client_id?: number;
  project_id?: number;
  manzana?: string;
  lote?: string;
};

type Option = {
  id: number;
  descripcion?: string;
  nombre_motivo?: string;
  tipo?: string;
  dias?: string;
  description?: string;
};

type Pagination<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export default function Supports() {
  const {
    supports: initialPagination,
    motives,
    appointmentTypes,
    waitingDays,
    internalStates,
    externalStates,
    types,
    projects,
  } = usePage<{
    supports: Pagination<Support>;
    motives: Option[];
    appointmentTypes: Option[];
    waitingDays: Option[];
    internalStates: Option[];
    externalStates: Option[];
    types: Option[];
    projects: Option[];
  }>().props;

  const [supports, setSupports] = useState<Support[]>(initialPagination.data);
  const [pagination, setPagination] = useState(initialPagination);
  const [showModal, setShowModal] = useState(false);
  const [editSupport, setEditSupport] = useState<Support | null>(null);

  const handleSupportSaved = (saved: Support) => {
    setSupports((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
    });
    setEditSupport(null);
  };

  const fetchSupport = async (id: number) => {
    const res = await axios.get(`/supports/${id}`);
    setEditSupport(res.data.support);
    setShowModal(true);
  };

  const fetchPage = async (url: string) => {
    try {
      const res = await axios.get(url);
      setSupports(res.data.supports.data);
      setPagination(res.data.supports);
    } catch (e) {
      console.error('Error al cargar página', e);
    }
  };

 useEffect(() => {
  console.log('▶️ Echo cargado:', echo);

  try {
    const channel = echo.channel('supports');

    channel.listen('.record.changed', (e: any) => {
      console.log('📡 Evento recibido:', e);

      if (e.model === 'Support') {
        switch (e.action) {
          case 'created':
            setSupports((prev) => {
              const exists = prev.some((s) => s.id === e.data.id);
              return exists ? prev : [e.data, ...prev];
            });
            break;
          case 'updated':
            setSupports((prev) =>
              prev.map((s) => (s.id === e.data.id ? e.data : s))
            );
            break;
          case 'deleted':
            setSupports((prev) => prev.filter((s) => s.id !== e.data.id));
            break;
        }
      }
    });
  } catch (error) {
    console.error('❌ Error al suscribirse a canal supports:', error);
  }

  return () => {
    echo.leave('supports');
  };
}, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Listado de Atenciones</h1>

        <button
          onClick={() => {
            setEditSupport(null);
            setShowModal(true);
          }}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Nuevo Soporte
        </button>

        <SupportTable
          supports={supports}
          setSupports={setSupports}
          pagination={pagination}
          fetchPage={fetchPage}
          fetchSupport={fetchSupport}
        />
      </div>

      {showModal && (
        <SupportModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditSupport(null);
          }}
          onSaved={handleSupportSaved}
          supportToEdit={editSupport}
          motives={motives}
          appointmentTypes={appointmentTypes}
          waitingDays={waitingDays}
          internalStates={internalStates}
          externalStates={externalStates}
          types={types}
          projects={projects}
        />
      )}
      <ChatWidget />
    </AppLayout>
  );
}

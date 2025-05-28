import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { Paintbrush, Trash2 } from 'lucide-react';
import SupportModal from './modal';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Soportes', href: '/supports' },
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
};

type Pagination<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export default function Supports() {
  const { supports: initialPagination } = usePage<{ supports: Pagination<Support> }>().props;

  const [supports, setSupports] = useState<Support[]>(initialPagination.data);
  const [pagination, setPagination] = useState(initialPagination);
  const [showModal, setShowModal] = useState(false);
  const [editSupport, setEditSupport] = useState<Support | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Listado de Soportes</h1>

        <button
          onClick={() => {
            setEditSupport(null);
            setShowModal(true);
          }}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Nuevo Soporte
        </button>

        {selectedIds.length > 0 && (
          <button
            onClick={async () => {
              if (confirm(`¿Eliminar ${selectedIds.length} tickets?`)) {
                try {
                  await axios.post('/supports/bulk-delete', { ids: selectedIds });
                  setSupports((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
                  setSelectedIds([]);
                } catch (e) {
                  alert('Error al eliminar en lote');
                  console.error(e);
                }
              }
            }}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Eliminar seleccionados
          </button>
        )}

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-black shadow-md rounded">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === supports.length}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? supports.map((s) => s.id) : [])
                    }
                  />
                </th>
                <th className="px-4 py-2">Acciones</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Asunto</th>
                <th className="px-4 py-2">Prioridad</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">Archivo</th>
              </tr>
            </thead>
            <tbody>
              {supports.map((support) => (
                <tr key={support.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(support.id)}
                      onChange={(e) =>
                        setSelectedIds((prev) =>
                          e.target.checked
                            ? [...prev, support.id]
                            : prev.filter((id) => id !== support.id)
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-2 text-sm space-x-2">
                    <button
                      onClick={() => fetchSupport(support.id)}
                      className="text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
                    >
                      <Paintbrush className="w-4 h-4" /> Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`¿Eliminar soporte "${support.subject}"?`)) {
                          try {
                            await axios.delete(`/supports/${support.id}`);
                            setSupports((prev) => prev.filter((s) => s.id !== support.id));
                          } catch (e) {
                            alert('Error al eliminar');
                            console.error(e);
                          }
                        }
                      }}
                      className="text-red-600 hover:underline dark:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </td>
                  <td className="px-4 py-2">{support.id}</td>
                  <td className="px-4 py-2">{support.subject}</td>
                  <td className="px-4 py-2">{support.priority}</td>
                  <td className="px-4 py-2">{support.type}</td>
                  <td className="px-4 py-2">{support.status}</td>
                  <td className="px-4 py-2">{support.cellphone}</td>
                  <td className="px-4 py-2">
                    {support.attachment && (
                      <a
                        href={`/attachments/${support.attachment}`}
                        download
                        className="text-blue-600 underline dark:text-blue-400"
                      >
                        {support.attachment}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(pagination.last_page)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => fetchPage(`/supports/fetch?page=${page}`)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  pagination.current_page === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                disabled={pagination.current_page === page}
              >
                {page}
              </button>
            );
          })}
        </div>
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
        />
      )}
    </AppLayout>
  );
}

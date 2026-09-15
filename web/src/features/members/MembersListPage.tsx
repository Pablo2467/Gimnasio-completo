// features/members/MembersListPage.tsx
import { Link } from "react-router-dom";
import { useMembers, useDeactivateMember } from "./useMembers";
import { useAuth } from "../../auth/AuthContext";

export function MembersListPage() {
  const { data: members, isLoading } = useMembers();
  const deactivate = useDeactivateMember();
  const { role } = useAuth();

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <Link to="/members/new" className="bg-slate-900 text-white px-4 py-2 rounded">
          + Nuevo
        </Link>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Nombre</th>
            <th>Email</th>
            <th>Documento</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {members?.map((m) => (
            <tr key={m.id} className="border-b">
              <td className="py-2">{m.fullName}</td>
              <td>{m.email}</td>
              <td>{m.documentId}</td>
              <td>
                <span
                  className={
                    m.status === "ACTIVE"
                      ? "text-green-700 bg-green-100 px-2 py-1 rounded text-xs"
                      : "text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs"
                  }
                >
                  {m.status}
                </span>
              </td>
              <td className="text-right space-x-2">
                <Link to={`/members/${m.id}/memberships`} className="text-sm text-blue-600">
                  Membresías
                </Link>
                {role === "ADMIN" && (
                  <button
                    onClick={() => {
                      if (confirm(`¿Desactivar a ${m.fullName}?`)) {
                        deactivate.mutate(m.id);
                      }
                    }}
                    className="text-sm text-red-600"
                  >
                    Desactivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
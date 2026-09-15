import { Link } from "react-router-dom";
import { useMembers, useDeactivateMember } from "./useMembers";
import { useAuth } from "../../auth/AuthContext";
import { DataTable } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Button } from "../../components/ui/Button";
import type { Member } from "../../types";

export function MembersListPage() {
  const { data: members, isLoading } = useMembers();
  const deactivate = useDeactivateMember();
  const { role } = useAuth();

  if (isLoading) return <p className="text-sm text-iron-400">Cargando clientes…</p>;

  function handleDeactivate(member: Member) {
    if (!confirm(`¿Desactivar a ${member.fullName}?`)) return;
    deactivate.mutate(member.id);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Link to="/members/new">
          <Button>Nuevo cliente</Button>
        </Link>
      </div>

      <DataTable
        rows={members}
        rowKey={(m) => m.id}
        empty={
          <>
            Aún no hay clientes registrados.{" "}
            <Link to="/members/new" className="text-plate-blue underline">
              Registra el primero
            </Link>
            .
          </>
        }
        columns={[
          { header: "Nombre", cell: (m) => <span className="font-medium">{m.fullName}</span> },
          { header: "Correo", cell: (m) => <span className="text-iron-700">{m.email}</span> },
          { header: "Documento", cell: (m) => m.documentId },
          { header: "Estado", cell: (m) => <StatusBadge status={m.status} /> },
          {
            header: "",
            align: "right",
            cell: (m) => (
              <div className="flex justify-end gap-3">
                <Link
                  to={`/members/${m.id}/memberships`}
                  className="text-sm text-plate-blue hover:underline"
                >
                  Membresías
                </Link>
                <Link
                  to={`/members/${m.id}/edit`}
                  className="text-sm text-iron-700 hover:underline"
                >
                  Editar
                </Link>
                {role === "ADMIN" && (
                  <button
                    onClick={() => handleDeactivate(m)}
                    className="text-sm text-plate-red hover:underline"
                  >
                    Desactivar
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
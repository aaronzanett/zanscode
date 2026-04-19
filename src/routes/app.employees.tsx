import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/employees")({
  component: Employees,
});

const people = [
  { name: "Andi Pratama", role: "Sales Lead", dept: "Sales", email: "andi@zanscode.com", status: "Active" },
  { name: "Maya Putri", role: "Account Executive", dept: "Sales", email: "maya@zanscode.com", status: "Active" },
  { name: "Reza Mahendra", role: "Engineer", dept: "Engineering", email: "reza@zanscode.com", status: "Active" },
  { name: "Sinta Lestari", role: "HR Generalist", dept: "People", email: "sinta@zanscode.com", status: "On leave" },
  { name: "Bagus Wicaksono", role: "Finance Analyst", dept: "Finance", email: "bagus@zanscode.com", status: "Active" },
];

function Employees() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm text-muted-foreground">Company directory and employment records.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ Add employee</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Department</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {people.map((p) => (
              <tr key={p.email} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-medium">{p.name}</td>
                <td className="px-5 py-4">{p.role}</td>
                <td className="px-5 py-4 text-muted-foreground">{p.dept}</td>
                <td className="px-5 py-4 text-muted-foreground">{p.email}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

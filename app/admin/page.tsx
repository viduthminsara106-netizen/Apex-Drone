import { db } from "@/lib/db";

export default async function AdminPage() {
  const usersRaw = await db.user.findMany({
    include: {
      transactions: true,
    },
  });

  // u: any සහ t: any ලෙස දමා TypeScript error එක ඉවත් කර ඇත
  const users = usersRaw.map((u: any) => ({
    ...u,
    totalCommissions: u.transactions
      ? u.transactions
          .filter((t: any) => t.type === 'COMMISSION')
          .reduce((acc: number, t: any) => acc + (t.amount || 0), 0)
      : 0
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Total Commission</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.name || "N/A"}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">LKR {user.totalCommissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
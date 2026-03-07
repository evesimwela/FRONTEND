import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import StatsCard from '../components/StatsCard'

const COLORS = ['#22c55e', '#eab308', '#ef4444']

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [predictions, setPredictions] = useState([])
  const [userPage, setUserPage] = useState(1)
  const [userPages, setUserPages] = useState(1)
  const [predPage, setPredPage] = useState(1)
  const [predPages, setPredPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])
  useEffect(() => { fetchUsers() }, [userPage])
  useEffect(() => { fetchPredictions() }, [predPage])

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data)
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?page=${userPage}&per_page=10`)
      setUsers(res.data.users)
      setUserPages(res.data.pages)
    } catch { /* ignore */ }
  }

  const fetchPredictions = async () => {
    try {
      const res = await api.get(`/admin/predictions?page=${predPage}&per_page=10`)
      setPredictions(res.data.predictions)
      setPredPages(res.data.pages)
    } catch { /* ignore */ }
  }

  const [pendingRoles, setPendingRoles] = useState({})

  const handleRoleSelect = (userId, role) => {
    setPendingRoles(prev => ({ ...prev, [userId]: role }))
  }

  const confirmRole = async (userId) => {
    const role = pendingRoles[userId]
    if (!role) return
    try {
      await api.put(`/admin/users/${userId}/role`, { role })
      setPendingRoles(prev => { const next = { ...prev }; delete next[userId]; return next })
      fetchUsers()
    } catch { /* ignore */ }
  }

  const cancelRole = (userId) => {
    setPendingRoles(prev => { const next = { ...prev }; delete next[userId]; return next })
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>
  if (!stats) return <div className="text-center py-16 text-gray-400">Failed to load admin data</div>

  const pieData = [
    { name: 'Low Risk', value: stats.risk_distribution.low },
    { name: 'Medium Risk', value: stats.risk_distribution.medium },
    { name: 'High Risk', value: stats.risk_distribution.high },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Users" value={stats.total_users} color="blue" />
        <StatsCard title="Total Predictions" value={stats.total_predictions} color="purple" />
        <StatsCard title="High Risk" value={stats.risk_distribution.high} color="red" />
        <StatsCard title="Low Risk" value={stats.risk_distribution.low} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Predictions Per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.predictions_per_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Predictions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">ID</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Username</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Role</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{u.id}</td>
                  <td className="px-6 py-4 font-medium">{u.username}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    {u.id === currentUser?.id ? (
                      <span className="text-sm text-gray-500 italic">{u.role} (you)</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select value={pendingRoles[u.id] ?? u.role} onChange={e => handleRoleSelect(u.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm">
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                        {pendingRoles[u.id] && pendingRoles[u.id] !== u.role && (
                          <>
                            <button onClick={() => confirmRole(u.id)}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-700">
                              Confirm
                            </button>
                            <button onClick={() => cancelRole(u.id)}
                              className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-400">
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {userPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-center gap-2">
            <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button>
            <span className="text-sm text-gray-500">Page {userPage} of {userPages}</span>
            <button onClick={() => setUserPage(p => Math.min(userPages, p + 1))} disabled={userPage === userPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>

      {/* All Predictions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">All Predictions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">ID</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">User</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Risk</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Probability</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {predictions.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{p.id}</td>
                  <td className="px-6 py-4">{p.user_id}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      p.prediction_probability >= 0.7 ? 'bg-red-100 text-red-700' :
                      p.prediction_probability >= 0.4 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {p.prediction_probability >= 0.7 ? 'High' : p.prediction_probability >= 0.4 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{(p.prediction_probability * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {predPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-center gap-2">
            <button onClick={() => setPredPage(p => Math.max(1, p - 1))} disabled={predPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button>
            <span className="text-sm text-gray-500">Page {predPage} of {predPages}</span>
            <button onClick={() => setPredPage(p => Math.min(predPages, p + 1))} disabled={predPage === predPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

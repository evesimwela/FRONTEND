import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api/axios'
import StatsCard from '../components/StatsCard'

export default function DashboardPage() {
  const [predictions, setPredictions] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [page])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/predict/history?page=${page}&per_page=10`)
      setPredictions(res.data.predictions)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const chartData = [...predictions].reverse().map(p => ({
    date: new Date(p.created_at).toLocaleDateString(),
    probability: Math.round(p.prediction_probability * 100),
  }))

  const avgRisk = predictions.length > 0
    ? Math.round(predictions.reduce((s, p) => s + p.prediction_probability, 0) / predictions.length * 100)
    : 0

  const highRiskCount = predictions.filter(p => p.prediction_probability >= 0.7).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Total Assessments" value={total} color="blue" />
        <StatsCard title="Average Risk" value={`${avgRisk}%`} color="yellow" />
        <StatsCard title="High Risk Results" value={highRiskCount} color="red" />
      </div>

      {chartData.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Risk Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="probability" stroke="#3b82f6" strokeWidth={2} name="Risk %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Prediction History</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : predictions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No predictions yet. <Link to="/predict" className="text-blue-600 hover:underline">Make your first assessment</Link></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Risk Level</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Probability</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Risk Score</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Symptoms</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {predictions.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString()}</td>
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
                      <td className="px-6 py-4">{p.risk_score}/8</td>
                      <td className="px-6 py-4">{p.symptom_count}/7</td>
                      <td className="px-6 py-4">
                        <Link to={`/result/${p.id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button>
                <span className="text-sm text-gray-500">Page {page} of {pages}</span>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

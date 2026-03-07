import { useState } from 'react'
import api from '../api/axios'
import PredictionForm from '../components/PredictionForm'
import RiskGauge from '../components/RiskGauge'
import RecommendationCard from '../components/RecommendationCard'

export default function PredictPage() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData) => {
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/predict/', formData)
      setResult(res.data.prediction)
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">AsthmaHealth Risk Assessment</h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <PredictionForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <RiskGauge probability={result.prediction_probability} result={result.prediction_result} />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk Score</span>
                    <span className="font-medium">{result.risk_score}/8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Symptom Count</span>
                    <span className="font-medium">{result.symptom_count}/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Probability</span>
                    <span className="font-medium">{(result.prediction_probability * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Recommendations</h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <RecommendationCard key={i} recommendation={rec} />
                  ))}
                </div>
              </div>
            </>
          )}
          {!result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-400">Fill out the form to get your asthma risk assessment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

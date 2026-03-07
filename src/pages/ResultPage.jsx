import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import RiskGauge from '../components/RiskGauge'
import RecommendationCard from '../components/RecommendationCard'

export default function ResultPage() {
  const { id } = useParams()
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/predict/${id}`)
      .then(res => setPrediction(res.data.prediction))
      .catch(err => setError(err.response?.data?.error || 'Failed to load prediction'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
  if (!prediction) return null

  const fields = [
    ['Age', prediction.age], ['Gender', prediction.gender],
    ['BMI', prediction.bmi], ['Residence', prediction.residence],
    ['Smoking Status', prediction.smoking_status],
    ['Physical Activity', prediction.physical_activity_level],
    ['Occupation', prediction.occupation_type],
    ['Air Pollution', prediction.air_pollution_level],
    ['Family History', prediction.family_history ? 'Yes' : 'No'],
    ['Allergies', prediction.allergies],
    ['Comorbidities', prediction.comorbidities],
    ['History of Allergies', prediction.history_of_allergies ? 'Yes' : 'No'],
    ['Respiratory Rate', prediction.respiratory_rate],
  ]

  const symptoms = [
    ['Wheezing', prediction.wheezing],
    ['Shortness of Breath', prediction.shortness_of_breath],
    ['Chest Tightness', prediction.chest_tightness],
    ['Chronic Cough', prediction.chronic_cough],
    ['Night Symptoms', prediction.night_symptoms],
    ['Exercise Triggered', prediction.symptoms_triggered_by_exercise],
    ['Dust Triggered', prediction.symptoms_triggered_by_dust],
  ]

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">&larr; Back to Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-800">Assessment Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Health Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {fields.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Symptoms</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {symptoms.map(([label, value]) => (
                <div key={label} className={`p-3 rounded-lg text-sm ${value ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-400'}`}>
                  {value ? '\u2713' : '\u2717'} {label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Recommendations</h3>
            <div className="space-y-3">
              {prediction.recommendations.map((rec, i) => (
                <RecommendationCard key={i} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RiskGauge probability={prediction.prediction_probability} result={prediction.prediction_result} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Risk Score</span><span className="font-medium">{prediction.risk_score}/8</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Symptom Count</span><span className="font-medium">{prediction.symptom_count}/7</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Probability</span><span className="font-medium">{(prediction.prediction_probability * 100).toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{new Date(prediction.created_at).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

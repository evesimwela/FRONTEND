export default function RiskGauge({ probability, result }) {
  const percentage = Math.round(probability * 100)
  const isPositive = result === 1

  let riskLevel, riskColor, bgColor
  if (probability >= 0.7) {
    riskLevel = 'High Risk'
    riskColor = 'text-red-600'
    bgColor = 'bg-red-500'
  } else if (probability >= 0.4) {
    riskLevel = 'Medium Risk'
    riskColor = 'text-yellow-600'
    bgColor = 'bg-yellow-500'
  } else {
    riskLevel = 'Low Risk'
    riskColor = 'text-green-600'
    bgColor = 'bg-green-500'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Prediction Result</h3>
      <div className="relative w-40 h-40 mx-auto mb-4">
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={probability >= 0.7 ? '#ef4444' : probability >= 0.4 ? '#eab308' : '#22c55e'}
            strokeWidth="10"
            strokeDasharray={`${percentage * 3.14} ${314 - percentage * 3.14}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${riskColor}`}>{percentage}%</span>
        </div>
      </div>
      <p className={`text-xl font-bold ${riskColor}`}>{riskLevel}</p>
      <p className="text-sm text-gray-500 mt-2">
        {isPositive ? 'Asthma indicators detected' : 'No significant asthma indicators'}
      </p>
    </div>
  )
}

export default function RecommendationCard({ recommendation }) {
  const priorityStyles = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-green-500 bg-green-50',
  }

  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  }

  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${priorityStyles[recommendation.priority] || priorityStyles.medium}`}>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-gray-800">{recommendation.title}</h4>
        <span className="text-xs font-medium text-gray-500 uppercase">
          {priorityLabels[recommendation.priority]}
        </span>
      </div>
      <p className="text-sm text-gray-600">{recommendation.description}</p>
    </div>
  )
}

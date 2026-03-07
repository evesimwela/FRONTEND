import { useState } from 'react'

const initialFormData = {
  age: '', gender: 'Male', bmi: '', residence: 'Urban',
  smoking_status: 'Non-Smoker', physical_activity_level: 'Moderate',
  occupation_type: 'Indoor', air_pollution_level: 'Low',
  family_history: 'No', allergies: 'Missing', comorbidities: 'Missing',
  history_of_allergies: 0,
  wheezing: 0, shortness_of_breath: 0, chest_tightness: 0,
  chronic_cough: 0, night_symptoms: 0,
  symptoms_triggered_by_exercise: 0, symptoms_triggered_by_dust: 0,
  respiratory_rate: '',
}

export default function PredictionForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialFormData)

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
  const inputClass = selectClass
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"
  const checkClass = "flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Age</label>
            <input type="number" min="1" max="120" required value={form.age} onChange={set('age')} className={inputClass} placeholder="Enter age" />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select value={form.gender} onChange={set('gender')} className={selectClass}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>BMI</label>
            <input type="number" step="0.1" min="10" max="60" required value={form.bmi} onChange={set('bmi')} className={inputClass} placeholder="Enter BMI" />
          </div>
          <div>
            <label className={labelClass}>Residence</label>
            <select value={form.residence} onChange={set('residence')} className={selectClass}>
              <option>Urban</option><option>Rural</option>
            </select>
          </div>
        </div>
      </section>

      {/* Lifestyle */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Lifestyle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Smoking Status</label>
            <select value={form.smoking_status} onChange={set('smoking_status')} className={selectClass}>
              <option>Non-Smoker</option><option>Ex-Smoker</option><option>Current Smoker</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Physical Activity Level</label>
            <select value={form.physical_activity_level} onChange={set('physical_activity_level')} className={selectClass}>
              <option>Low</option><option>Moderate</option><option>High</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Occupation Type</label>
            <select value={form.occupation_type} onChange={set('occupation_type')} className={selectClass}>
              <option>Indoor</option><option>Mixed</option><option>Outdoor</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Air Pollution Level</label>
            <select value={form.air_pollution_level} onChange={set('air_pollution_level')} className={selectClass}>
              <option>Low</option><option>Moderate</option><option>High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Medical History */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Medical History</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Allergies</label>
            <select value={form.allergies} onChange={set('allergies')} className={selectClass}>
              <option value="Missing">None</option><option>Dust</option><option>Food</option>
              <option>Pollen</option><option>Pets</option><option>Multiple</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Comorbidities</label>
            <select value={form.comorbidities} onChange={set('comorbidities')} className={selectClass}>
              <option value="Missing">None</option><option>Diabetes</option>
              <option>Hypertension</option><option>Both</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Respiratory Rate (breaths/min)</label>
            <input type="number" min="8" max="40" required value={form.respiratory_rate} onChange={set('respiratory_rate')} className={inputClass} placeholder="e.g. 18" />
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <label className={checkClass}>
              <input type="checkbox" checked={form.family_history === 'Yes'} onChange={(e) => setForm(prev => ({ ...prev, family_history: e.target.checked ? 'Yes' : 'No' }))} className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Family History of Asthma</span>
            </label>
            <label className={checkClass}>
              <input type="checkbox" checked={form.history_of_allergies === 1} onChange={set('history_of_allergies')} className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">History of Allergies</span>
            </label>
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Current Symptoms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ['wheezing', 'Wheezing'],
            ['shortness_of_breath', 'Shortness of Breath'],
            ['chest_tightness', 'Chest Tightness'],
            ['chronic_cough', 'Chronic Cough'],
            ['night_symptoms', 'Night Symptoms'],
            ['symptoms_triggered_by_exercise', 'Symptoms Triggered by Exercise'],
            ['symptoms_triggered_by_dust', 'Symptoms Triggered by Dust'],
          ].map(([field, label]) => (
            <label key={field} className={checkClass}>
              <input type="checkbox" checked={form[field] === 1} onChange={set(field)} className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Analyzing...' : 'Get Prediction'}
      </button>
    </form>
  )
}

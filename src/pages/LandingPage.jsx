import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6">
          Know Your Asthma Risk
        </h1>
        <p className="text-xl text-black max-w-2xl mx-auto mb-8">
          Get an instant AI-powered asthma risk assessment with personalized health recommendations based on your medical profile.
        </p>
        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Link to="/predict" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              Start Assessment
            </Link>
          ) : (
            <>
              <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
              <Link to="/login" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter Health Info</h3>
            <p className="text-gray-500 text-sm">Fill out a quick form with your personal, lifestyle, and symptom details.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Your Risk Score</h3>
            <p className="text-gray-500 text-sm">Our ML model analyzes your data and provides an instant asthma risk prediction.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Recommendations</h3>
            <p className="text-gray-500 text-sm">Receive personalized health advice and track your results over time.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600">20+</p>
            <p className="text-gray-500 mt-1">Health Factors Analyzed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">Instant</p>
            <p className="text-gray-500 mt-1">Risk Assessment</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">Free</p>
            <p className="text-gray-500 mt-1">To Use</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Take Control of Your Health</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">Early detection and awareness are key to managing asthma effectively.</p>
        {user ? (
          <Link to="/predict" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
            Start Assessment
          </Link>
        ) : (
          <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
            Create Free Account
          </Link>
        )}
      </section>
    </div>
  )
}

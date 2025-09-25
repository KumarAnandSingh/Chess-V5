import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const LearnChessOnlineFreePage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Learn Chess Online Free - Interactive Lessons & Training',
        page_location: window.location.href,
        send_page_view: false
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Learn Chess Online Free - Interactive Lessons & AI Training | Studyify</title>
        <meta 
          name="description" 
          content="Learn chess online free with interactive lessons, AI-powered training, and guided practice. Master chess strategy, tactics, openings from beginner to advanced level." 
        />
        <meta 
          name="keywords" 
          content="learn chess online free, free chess lessons, chess training online, chess course free, interactive chess learning" 
        />
        <link rel="canonical" href="https://studyify.in/learn-chess-online-free" />
        
        <meta property="og:title" content="Learn Chess Online Free - Interactive Lessons" />
        <meta property="og:description" content="Free chess education with AI-powered lessons, interactive training, and guided practice. Learn from beginner to master level." />
        <meta property="og:url" content="https://studyify.in/learn-chess-online-free" />
      </Helmet>

      <div className="seo-landing-page">
        <section className="hero-section bg-gradient-to-b from-blue-600 to-indigo-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn Chess Online Free - Interactive Lessons & Training
            </h1>
            <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
              Master chess with free interactive lessons, AI-powered training, and guided practice. 
              Learn chess strategy, tactics, and openings from beginner to advanced level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/lessons"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                📚 Start Free Lessons
              </Link>
              <Link
                to="/play"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                🎮 Practice While Learning
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Complete Free Chess Education Path
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="learning-stage bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-xl font-bold mb-3 text-green-600">Beginner</h3>
                <p className="text-gray-700 mb-4">Learn chess rules, piece movements, and basic tactics</p>
                <ul className="text-sm text-gray-600 text-left space-y-1">
                  <li>• Chess board setup</li>
                  <li>• How pieces move</li>
                  <li>• Check and checkmate</li>
                  <li>• Basic tactics</li>
                </ul>
              </div>
              <div className="learning-stage bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">Intermediate</h3>
                <p className="text-gray-700 mb-4">Master opening principles and tactical patterns</p>
                <ul className="text-sm text-gray-600 text-left space-y-1">
                  <li>• Opening principles</li>
                  <li>• Tactical combinations</li>
                  <li>• Pawn structure</li>
                  <li>• Endgame basics</li>
                </ul>
              </div>
              <div className="learning-stage bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">Advanced</h3>
                <p className="text-gray-700 mb-4">Develop strategic thinking and complex tactics</p>
                <ul className="text-sm text-gray-600 text-left space-y-1">
                  <li>• Positional play</li>
                  <li>• Complex tactics</li>
                  <li>• Opening repertoire</li>
                  <li>• Advanced endgames</li>
                </ul>
              </div>
              <div className="learning-stage bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-xl font-bold mb-3 text-red-600">Expert</h3>
                <p className="text-gray-700 mb-4">Master-level strategy and tournament preparation</p>
                <ul className="text-sm text-gray-600 text-left space-y-1">
                  <li>• Deep strategy</li>
                  <li>• Opening theory</li>
                  <li>• Master endgames</li>
                  <li>• Game analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Our Free Chess Learning Beats Premium Courses
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="comparison-card bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="text-2xl font-bold mb-4 text-green-600">🏆 Studyify Free Chess Learning</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Interactive lessons with AI guidance
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Learn by playing against computer
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Real-time move analysis and feedback
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Adaptive difficulty based on your level
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Complete curriculum (400-2200 ELO)
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> No payment required - ever!
                  </li>
                </ul>
              </div>
              <div className="comparison-card bg-red-50 p-6 rounded-lg border-2 border-red-200">
                <h3 className="text-2xl font-bold mb-4 text-red-600">💰 Premium Chess Courses</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-red-500">
                    <span className="mr-2">❌</span> High monthly subscription fees
                  </li>
                  <li className="flex items-center text-red-500">
                    <span className="mr-2">❌</span> Limited free content available
                  </li>
                  <li className="flex items-center text-yellow-500">
                    <span className="mr-2">⚠️</span> Basic analysis in free tier
                  </li>
                  <li className="flex items-center text-red-500">
                    <span className="mr-2">❌</span> Paywall blocks advanced lessons
                  </li>
                  <li className="flex items-center text-yellow-500">
                    <span className="mr-2">⚠️</span> Limited practice opportunities
                  </li>
                  <li className="flex items-center text-red-500">
                    <span className="mr-2">❌</span> Cancel anytime but lose access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Free Chess Learning Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-3 text-center">🧠</div>
                <h3 className="text-xl font-bold mb-3 text-blue-600 text-center">AI-Powered Learning</h3>
                <p className="text-gray-700">
                  Personalized chess education with AI that adapts to your learning style and pace. 
                  Get explanations tailored to your skill level.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-3 text-center">🎯</div>
                <h3 className="text-xl font-bold mb-3 text-green-600 text-center">Interactive Practice</h3>
                <p className="text-gray-700">
                  Learn by doing! Every lesson includes hands-on practice against our chess engine. 
                  Apply concepts immediately in real games.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-3 text-center">📊</div>
                <h3 className="text-xl font-bold mb-3 text-purple-600 text-center">Progress Tracking</h3>
                <p className="text-gray-700">
                  Monitor your chess improvement with detailed analytics. See your rating grow 
                  and track mastery of different chess concepts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Free Chess Learning - Common Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Is chess learning really free here with no hidden costs?</h3>
                <p className="text-gray-700">
                  Yes, completely free! Unlike Chess.com's premium lessons or ChessMood's paid courses, 
                  all our educational content is accessible without any payment or subscription.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">How effective is learning chess online vs in-person lessons?</h3>
                <p className="text-gray-700">
                  Online chess learning with AI offers personalized pacing, unlimited practice, and 
                  instant feedback that's often more effective than traditional lessons at a fraction of the cost.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Can complete beginners learn chess online free here?</h3>
                <p className="text-gray-700">
                  Absolutely! Our curriculum starts with the very basics - how pieces move, chess rules, 
                  and simple tactics. Perfect for anyone starting their chess journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Learning Chess Online Free Today!
            </h2>
            <p className="text-xl mb-6">
              Join thousands of players who've improved their chess with our free interactive lessons.
            </p>
            <Link
              to="/lessons"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-xl font-semibold transition-colors inline-block"
            >
              🚀 Begin Your Free Chess Education
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default LearnChessOnlineFreePage;
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PlayChessOnlineFreePage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Play Chess Online Free - No Registration Required',
        page_location: window.location.href,
        send_page_view: false
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Play Chess Online Free - No Registration Required | Studyify</title>
        <meta 
          name="description" 
          content="Play chess online free with no registration, no ads, no plugin required. Free chess server with computer opponents, interactive lessons, and guided practice. Start playing instantly!" 
        />
        <meta 
          name="keywords" 
          content="play chess online free, free chess game, no registration chess, chess online no download, free chess server, chess without signup" 
        />
        <link rel="canonical" href="https://studyify.in/play-chess-online-free" />
        
        <meta property="og:title" content="Play Chess Online Free - No Registration Required" />
        <meta property="og:description" content="Free online chess server. Play against computer or learn with interactive lessons. No registration, no ads, no plugin required." />
        <meta property="og:url" content="https://studyify.in/play-chess-online-free" />
      </Helmet>

      <div className="seo-landing-page">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-b from-green-600 to-green-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Play Chess Online Free - No Registration Required
            </h1>
            <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
              Free online chess server. Play chess in a clean interface with no registration, 
              no ads, no plugin required. Just pure chess learning and practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/play"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                🎮 Play Chess Now - 100% Free
              </Link>
              <Link
                to="/lessons"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                📚 Free Chess Lessons
              </Link>
            </div>
            <div className="flex justify-center items-center gap-6 text-sm opacity-90">
              <span>✅ No Registration</span>
              <span>✅ No Ads</span>
              <span>✅ No Download</span>
              <span>✅ No Plugin Required</span>
            </div>
          </div>
        </section>

        {/* Free Features Comparison */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Truly Free Chess Online - No Hidden Costs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="feature-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">🆓</div>
                <h3 className="text-xl font-bold mb-3 text-green-600">100% Free</h3>
                <p className="text-gray-700">
                  Play unlimited chess games with no payment required. 
                  All features available without premium subscription.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">Instant Play</h3>
                <p className="text-gray-700">
                  Start playing immediately with no account creation, 
                  email verification, or registration process.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">🚫</div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">No Ads</h3>
                <p className="text-gray-700">
                  Clean, distraction-free chess interface with no advertising 
                  interrupting your games or learning.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="text-xl font-bold mb-3 text-orange-600">Browser-Based</h3>
                <p className="text-gray-700">
                  No download, no installation, no plugin required. 
                  Works on any device with a web browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Over Other Free Chess Sites */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Our Free Chess Platform Beats the Competition
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="comparison-card">
                <h3 className="text-2xl font-bold mb-4 text-green-600">🏆 Studyify Chess (Free)</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Play against computer (400-2200 ELO)
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Interactive learning lessons
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Real-time move analysis
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> No registration required
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Completely ad-free
                  </li>
                  <li className="flex items-center text-green-600">
                    <span className="mr-2">✅</span> Mobile-friendly interface
                  </li>
                </ul>
              </div>
              <div className="comparison-card">
                <h3 className="text-2xl font-bold mb-4 text-gray-600">⚠️ Other "Free" Chess Sites</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-red-500">
                    <span className="mr-2">❌</span> Limited computer opponents
                  </li>
                  <li className="flex items-center text-red-500">
                    <span className="mr-2">❌</span> Premium features locked
                  </li>
                  <li className="flex items-center text-yellow-500">
                    <span className="mr-2">⚠️</span> Basic analysis only
                  </li>
                  <li className="flex items-center text-red-500">
                    <span className="mr-2">❌</span> Registration required for features
                  </li>
                  <li className="flex items-center text-red-500">
                    <span className="mr-2">❌</span> Intrusive advertisements
                  </li>
                  <li className="flex items-center text-yellow-500">
                    <span className="mr-2">⚠️</span> Mobile experience varies
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Free Chess Learning Path */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Your Free Chess Learning Journey
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="step-card bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
                  <h3 className="text-xl font-bold mb-3">Start Playing</h3>
                  <p className="text-gray-700">
                    Jump straight into playing chess against our AI. No signup needed - 
                    just click and start your first game.
                  </p>
                  <Link 
                    to="/play" 
                    className="inline-block mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Play Now
                  </Link>
                </div>
                <div className="step-card bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-3xl font-bold text-green-600 mb-3">2</div>
                  <h3 className="text-xl font-bold mb-3">Learn Interactively</h3>
                  <p className="text-gray-700">
                    Take guided lessons that teach you chess strategy, tactics, 
                    and openings through hands-on practice.
                  </p>
                  <Link 
                    to="/lessons" 
                    className="inline-block mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Learn Chess
                  </Link>
                </div>
                <div className="step-card bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-3">3</div>
                  <h3 className="text-xl font-bold mb-3">Track Progress</h3>
                  <p className="text-gray-700">
                    Monitor your improvement with our progress tracking. 
                    See your rating grow as you master chess skills.
                  </p>
                  <Link 
                    to="/dashboard" 
                    className="inline-block mt-3 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                  >
                    View Progress
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ for Free Chess */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Free Chess Online - Common Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Is it really free to play chess online here?</h3>
                <p className="text-gray-700">
                  Yes, completely free! Unlike Chess.com which charges for premium features, 
                  we provide unlimited chess games, computer opponents, lessons, and analysis at no cost.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Do I need to register to play chess online free?</h3>
                <p className="text-gray-700">
                  No registration required! You can start playing immediately. Optional account creation 
                  only helps save your progress and game history.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">How does this compare to Lichess free chess?</h3>
                <p className="text-gray-700">
                  Like Lichess, we're completely free with no premium model. We add interactive 
                  learning features and guided lessons that make chess education more accessible.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Can I play chess online free on mobile?</h3>
                <p className="text-gray-700">
                  Absolutely! Our responsive design works perfectly on phones and tablets. 
                  No app download required - just use your mobile browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Playing Chess Online Free Right Now!
            </h2>
            <p className="text-xl mb-6">
              No barriers, no payments, no registration - just pure chess learning and fun.
            </p>
            <Link
              to="/play"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-xl font-semibold transition-colors inline-block"
            >
              🚀 Play Your First Free Game Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default PlayChessOnlineFreePage;
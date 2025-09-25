import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ChessAgainstComputerPage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Chess Against Computer - AI Opponents All Skill Levels',
        page_location: window.location.href,
        send_page_view: false
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Chess Against Computer - Play AI Opponents All Skill Levels | Studyify</title>
        <meta 
          name="description" 
          content="Play chess against computer opponents from 400-2200 ELO. AI chess engine adapts to your skill level. Free computer chess with analysis, lessons, and practice modes." 
        />
        <meta 
          name="keywords" 
          content="chess against computer, AI chess opponent, computer chess game, chess vs AI, chess engine, play computer chess" 
        />
        <link rel="canonical" href="https://studyify.in/chess-against-computer" />
        
        <meta property="og:title" content="Chess Against Computer - AI Opponents All Levels" />
        <meta property="og:description" content="Challenge AI chess opponents from beginner to master level. Adaptive computer chess with real-time analysis and learning features." />
        <meta property="og:url" content="https://studyify.in/chess-against-computer" />
      </Helmet>

      <div className="seo-landing-page">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-b from-purple-600 to-purple-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chess Against Computer - Challenge AI Opponents
            </h1>
            <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
              Play chess vs computer opponents of all skill levels. Our AI adapts from beginner (400 ELO) 
              to master (2200 ELO) for the perfect chess challenge and learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/play"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                🤖 Challenge Computer Now
              </Link>
              <Link
                to="/lessons"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                📈 Improve vs AI Training
              </Link>
            </div>
          </div>
        </section>

        {/* AI Skill Levels */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Choose Your Computer Chess Opponent Level
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="skill-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl mb-3">🌱</div>
                <h3 className="text-xl font-bold mb-3 text-green-600">Beginner AI</h3>
                <p className="text-lg font-semibold text-green-600 mb-2">400-800 ELO</p>
                <p className="text-gray-700 text-sm">
                  Perfect for new players learning chess basics. Makes human-like mistakes to help you build confidence.
                </p>
              </div>
              <div className="skill-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">Intermediate AI</h3>
                <p className="text-lg font-semibold text-blue-600 mb-2">800-1400 ELO</p>
                <p className="text-gray-700 text-sm">
                  Challenging computer opponent that teaches solid chess principles and tactical awareness.
                </p>
              </div>
              <div className="skill-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">Advanced AI</h3>
                <p className="text-lg font-semibold text-purple-600 mb-2">1400-1800 ELO</p>
                <p className="text-gray-700 text-sm">
                  Strong computer chess engine that challenges your strategic thinking and calculation skills.
                </p>
              </div>
              <div className="skill-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl mb-3">👑</div>
                <h3 className="text-xl font-bold mb-3 text-red-600">Master AI</h3>
                <p className="text-lg font-semibold text-red-600 mb-2">1800-2200 ELO</p>
                <p className="text-gray-700 text-sm">
                  Elite chess computer for serious players seeking the ultimate chess challenge and improvement.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/play"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                🎯 Start Playing vs Computer
              </Link>
            </div>
          </div>
        </section>

        {/* Computer Chess Features */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Advanced Computer Chess Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="text-xl font-bold mb-3 text-blue-600">🧠 Adaptive AI Engine</h3>
                <p className="text-gray-700">
                  Our computer chess engine learns your playing style and adjusts its strategy 
                  to provide optimal learning challenges at every level.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-3 text-green-600">📊 Real-time Analysis</h3>
                <p className="text-gray-700">
                  See computer evaluations in real-time during your game. Understand why 
                  the AI makes certain moves and learn from computer insights.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 className="text-xl font-bold mb-3 text-purple-600">🎓 Learning Mode</h3>
                <p className="text-gray-700">
                  Play against computer with built-in hints and explanations. The AI guides 
                  your improvement with educational feedback after each game.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Computer Chess vs Human Chess */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Play Chess Against Computer vs Humans?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="advantage-card bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-green-600">🤖 Computer Chess Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Available 24/7 - play anytime you want</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Consistent skill level - no mood swings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Infinite patience - take your time thinking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Educational feedback and analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>No time pressure or social anxiety</span>
                  </li>
                </ul>
              </div>
              <div className="advantage-card bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">👥 Human Chess Challenges</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Limited availability - need to find opponents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Unpredictable skill levels and playing styles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>May rush moves or abandon games</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Limited learning feedback</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Can be intimidating for beginners</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Chess Against Computer - Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">How strong are your computer chess opponents?</h3>
                <p className="text-gray-700">
                  Our AI ranges from 400 ELO (beginner) to 2200 ELO (master level). This covers everyone from 
                  complete beginners to advanced tournament players, with adaptive difficulty adjustment.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Does the computer chess engine cheat or play unfairly?</h3>
                <p className="text-gray-700">
                  No, our AI plays fair chess with no cheating. At lower levels, it intentionally makes human-like 
                  mistakes to provide appropriate challenges for learning players.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Can I see the computer's analysis during the game?</h3>
                <p className="text-gray-700">
                  Yes! Real-time engine evaluation helps you understand position strengths and learn from 
                  the computer's strategic thinking throughout the game.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Is playing chess against computer better than Chess.com bots?</h3>
                <p className="text-gray-700">
                  Our computer opponents offer more educational features and adaptive learning compared to 
                  Chess.com's limited free bots. Plus, all features are completely free with no premium restrictions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Challenge Our Chess Computer?
            </h2>
            <p className="text-xl mb-6">
              Test your skills against AI opponents designed to help you improve at chess.
            </p>
            <Link
              to="/play"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-xl font-semibold transition-colors inline-block"
            >
              🤖 Start Chess vs Computer Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChessAgainstComputerPage;
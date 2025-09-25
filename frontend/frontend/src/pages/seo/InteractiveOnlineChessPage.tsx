import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const InteractiveOnlineChessPage: React.FC = () => {
  useEffect(() => {
    // Track page view for SEO analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Interactive Online Chess - Play Against Computer & Friends Free',
        page_location: window.location.href,
        send_page_view: false
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Interactive Online Chess - Play Against Computer & Friends Free | Studyify</title>
        <meta 
          name="description" 
          content="Play interactive online chess against computer opponents of all skill levels. Free chess game with 400-2200 ELO difficulty, real-time analysis, guided practice lessons. No registration required - start playing instantly!" 
        />
        <meta 
          name="keywords" 
          content="interactive online chess, play chess online free, chess against computer, free chess game, online chess platform, chess training, interactive chess lessons, chess for all levels" 
        />
        <link rel="canonical" href="https://studyify.in/interactive-online-chess" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Interactive Online Chess - Play Free Against Computer" />
        <meta property="og:description" content="Free interactive chess platform with AI opponents, guided lessons, and skill-based matchmaking. Practice chess tactics and strategy online." />
        <meta property="og:url" content="https://studyify.in/interactive-online-chess" />
        <meta property="og:type" content="website" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Interactive Online Chess",
            "description": "Play interactive online chess against computer opponents of all skill levels. Free chess training with guided lessons and real-time analysis.",
            "url": "https://studyify.in/interactive-online-chess",
            "mainEntity": {
              "@type": "Game",
              "name": "Interactive Online Chess",
              "description": "Free online chess game with AI opponents, skill-based difficulty, and interactive lessons",
              "gameItem": ["Chess pieces", "Chess board", "AI opponents"],
              "numberOfPlayers": "1-2",
              "genre": "Strategy, Board Game, Educational"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://studyify.in/"
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "Interactive Online Chess",
                  "item": "https://studyify.in/interactive-online-chess"
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="seo-landing-page">
        {/* Hero Section - Above the fold SEO optimization */}
        <section className="hero-section bg-gradient-to-b from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Interactive Online Chess - Play Free Against Computer
            </h1>
            <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
              Practice chess vs. computer opponents of all skill levels. Free interactive chess game with 
              guided lessons, real-time analysis, and no registration required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/play"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                🎯 Play Chess Now - Free
              </Link>
              <Link
                to="/lessons"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                📚 Learn Chess Interactively
              </Link>
            </div>
            <p className="text-sm opacity-90">
              ✅ No download required ✅ No registration needed ✅ Start playing in seconds
            </p>
          </div>
        </section>

        {/* Key Features - Target competitor advantages */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Choose Our Interactive Online Chess Platform?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-blue-600">🤖 AI Chess Opponents</h3>
                <p className="text-gray-700">
                  Play against computer opponents from 400 to 2200 ELO. Adaptive difficulty 
                  that matches your skill level for optimal learning and challenge.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-green-600">📖 Interactive Lessons</h3>
                <p className="text-gray-700">
                  Guided practice lessons with step-by-step explanations. Learn chess strategy, 
                  tactics, openings, and endgames through interactive gameplay.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-purple-600">⚡ Real-time Analysis</h3>
                <p className="text-gray-700">
                  Get instant feedback on your moves with real-time chess analysis. 
                  Understand your mistakes and improve your game immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison vs Competitors */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Interactive Online Chess: Free vs Premium Platforms
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left">Feature</th>
                    <th className="p-4 text-center">Studyify Chess</th>
                    <th className="p-4 text-center">Chess.com</th>
                    <th className="p-4 text-center">Lichess</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Play Against Computer</td>
                    <td className="p-4 text-center text-green-600">✅ Free</td>
                    <td className="p-4 text-center text-yellow-600">⚠️ Limited</td>
                    <td className="p-4 text-center text-green-600">✅ Free</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Interactive Lessons</td>
                    <td className="p-4 text-center text-green-600">✅ AI-Powered</td>
                    <td className="p-4 text-center text-red-600">💰 Premium</td>
                    <td className="p-4 text-center text-yellow-600">⚠️ Basic</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Real-time Analysis</td>
                    <td className="p-4 text-center text-green-600">✅ All Games</td>
                    <td className="p-4 text-center text-red-600">💰 Premium</td>
                    <td className="p-4 text-center text-green-600">✅ Free</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">No Registration Required</td>
                    <td className="p-4 text-center text-green-600">✅ Play Instantly</td>
                    <td className="p-4 text-center text-red-600">❌ Account Required</td>
                    <td className="p-4 text-center text-green-600">✅ Guest Play</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ - Target long-tail keywords */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Interactive Online Chess - Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="faq-item bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold mb-2 text-lg">How do I play interactive online chess for free?</h3>
                <p className="text-gray-700">
                  Simply click "Play Chess Now" above! No registration, no download, no payment required. 
                  Choose your difficulty level from 400-2200 ELO and start playing against our AI opponent immediately.
                </p>
              </div>
              <div className="faq-item bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold mb-2 text-lg">What makes this chess platform interactive?</h3>
                <p className="text-gray-700">
                  Our interactive features include real-time move analysis, guided practice lessons, 
                  step-by-step strategy explanations, and adaptive AI opponents that adjust to your skill level.
                </p>
              </div>
              <div className="faq-item bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold mb-2 text-lg">Can beginners play interactive online chess here?</h3>
                <p className="text-gray-700">
                  Absolutely! We offer beginner-friendly chess starting at 400 ELO with interactive tutorials, 
                  guided lessons, and gentle AI opponents perfect for learning basic chess rules and strategy.
                </p>
              </div>
              <div className="faq-item bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold mb-2 text-lg">Is this better than Chess.com for interactive learning?</h3>
                <p className="text-gray-700">
                  Our platform offers free access to interactive lessons and analysis that Chess.com charges for. 
                  Plus, no registration required - you can start learning and playing immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Playing Interactive Online Chess Now!
            </h2>
            <p className="text-xl mb-6">
              Join thousands of players improving their chess skills with our free interactive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/play"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                🚀 Play Chess Against Computer
              </Link>
              <Link
                to="/lessons"
                className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                📚 Interactive Chess Lessons
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InteractiveOnlineChessPage;
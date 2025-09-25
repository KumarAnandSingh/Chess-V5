import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ChessForBeginnersPage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Chess for Beginners - Learn Chess Rules & Strategy Free',
        page_location: window.location.href,
        send_page_view: false
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Chess for Beginners - Learn Chess Rules & Strategy Free | Studyify</title>
        <meta 
          name="description" 
          content="Learn chess for beginners with step-by-step tutorials, interactive lessons, and gentle AI opponents. Master chess rules, basic strategy, and tactics from scratch - completely free!" 
        />
        <meta 
          name="keywords" 
          content="chess for beginners, learn chess rules, beginner chess lessons, how to play chess, chess tutorial, chess basics" 
        />
        <link rel="canonical" href="https://studyify.in/chess-for-beginners" />
        
        <meta property="og:title" content="Chess for Beginners - Learn Chess from Scratch" />
        <meta property="og:description" content="Perfect chess course for beginners. Learn rules, strategy, and tactics with interactive lessons and gentle AI practice." />
        <meta property="og:url" content="https://studyify.in/chess-for-beginners" />
      </Helmet>

      <div className="seo-landing-page">
        <section className="hero-section bg-gradient-to-b from-green-500 to-emerald-700 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chess for Beginners - Learn from Scratch, Free!
            </h1>
            <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
              Perfect chess course for complete beginners. Learn chess rules, basic strategy, 
              and tactics with gentle AI opponents and step-by-step interactive tutorials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/lessons"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                📚 Start Beginner Lessons
              </Link>
              <Link
                to="/play"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                🎮 Practice vs Gentle AI
              </Link>
            </div>
            <p className="text-lg opacity-90">
              ✨ Never played chess? No problem! Start your journey today.
            </p>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Complete Beginner Chess Learning Path
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="step-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">1️⃣</div>
                <h3 className="text-xl font-bold mb-3 text-green-600">Chess Basics</h3>
                <p className="text-gray-700 mb-4">Learn the chessboard, how pieces move, and basic rules</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Board setup</li>
                  <li>• Piece movements</li>
                  <li>• Special moves</li>
                  <li>• Game objective</li>
                </ul>
              </div>
              <div className="step-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">2️⃣</div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">First Games</h3>
                <p className="text-gray-700 mb-4">Practice with ultra-gentle AI opponents (400 ELO)</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Patient AI opponent</li>
                  <li>• Move suggestions</li>
                  <li>• Undo mistakes</li>
                  <li>• No time pressure</li>
                </ul>
              </div>
              <div className="step-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">3️⃣</div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">Basic Tactics</h3>
                <p className="text-gray-700 mb-4">Master simple patterns and winning strategies</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Checkmate patterns</li>
                  <li>• Basic captures</li>
                  <li>• Piece protection</li>
                  <li>• Simple tactics</li>
                </ul>
              </div>
              <div className="step-card bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-3">4️⃣</div>
                <h3 className="text-xl font-bold mb-3 text-orange-600">Strategy Basics</h3>
                <p className="text-gray-700 mb-4">Understand opening principles and game planning</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Opening principles</li>
                  <li>• Center control</li>
                  <li>• King safety</li>
                  <li>• Piece development</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Beginners Choose Our Chess Course
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-3 text-green-600">👶 Truly Beginner-Friendly</h3>
                <p className="text-gray-700">
                  Designed for complete novices. No intimidating jargon or advanced concepts. 
                  We start with the absolute basics and build gradually.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="text-xl font-bold mb-3 text-blue-600">🤖 Patient AI Teachers</h3>
                <p className="text-gray-700">
                  Our AI opponents start at 400 ELO - perfect for beginners. They make mistakes 
                  too, helping you build confidence as you learn.
                </p>
              </div>
              <div className="feature-card bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 className="text-xl font-bold mb-3 text-purple-600">📖 Interactive Learning</h3>
                <p className="text-gray-700">
                  Learn by doing! Every concept is immediately practiced in real games. 
                  No boring theory - just fun, hands-on chess learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Common Beginner Chess Fears (And How We Solve Them)
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="fear-solution bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-3 text-red-500">😰 "Chess seems too complicated"</h3>
                  <p className="text-gray-700">
                    <strong className="text-green-600">Our Solution:</strong> We break everything into tiny, digestible steps. 
                    You'll learn one piece at a time, one concept at a time. No overwhelming information dumps!
                  </p>
                </div>
                <div className="fear-solution bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-3 text-red-500">😰 "I'm too old to learn chess"</h3>
                  <p className="text-gray-700">
                    <strong className="text-green-600">Our Solution:</strong> Chess is for all ages! Our patient AI and 
                    self-paced lessons work perfectly for adult learners. No age limits on fun!
                  </p>
                </div>
                <div className="fear-solution bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-3 text-red-500">😰 "I'll lose every game"</h3>
                  <p className="text-gray-700">
                    <strong className="text-green-600">Our Solution:</strong> Our beginner AI makes mistakes too! 
                    You'll win games while learning. Plus, every "loss" comes with helpful explanations.
                  </p>
                </div>
                <div className="fear-solution bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-3 text-red-500">😰 "Chess players are intimidating"</h3>
                  <p className="text-gray-700">
                    <strong className="text-green-600">Our Solution:</strong> Start by playing our friendly AI! 
                    Build confidence in a judgment-free environment before playing humans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Chess for Beginners - Your Questions Answered
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">How long does it take to learn chess as a beginner?</h3>
                <p className="text-gray-700">
                  Most beginners can learn the basic rules in 30 minutes and start playing enjoyable games within a week. 
                  Our interactive approach makes learning faster and more fun than traditional methods.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Is this beginner chess course really free?</h3>
                <p className="text-gray-700">
                  Yes! Unlike Chess.com's premium beginner courses, all our educational content is completely free. 
                  No hidden costs, no premium upgrades required.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Do I need to download anything to learn chess here?</h3>
                <p className="text-gray-700">
                  No download required! Our beginner chess course runs entirely in your web browser. 
                  Works on phones, tablets, and computers.
                </p>
              </div>
              <div className="faq-item bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">What if I make mistakes while learning chess?</h3>
                <p className="text-gray-700">
                  Mistakes are part of learning! Our system includes undo features, move hints, and gentle 
                  corrections. You'll learn from mistakes without frustration.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Chess Journey?
            </h2>
            <p className="text-xl mb-6">
              Join thousands of beginners who learned chess the fun and easy way with our free course.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/lessons"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-xl font-semibold transition-colors"
              >
                🚀 Start Learning Chess Now
              </Link>
              <Link
                to="/play"
                className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-xl font-semibold transition-colors"
              >
                🎮 Try a Gentle Game First
              </Link>
            </div>
            <p className="mt-4 opacity-90">
              ✨ Perfect for complete beginners - Start your chess adventure today!
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChessForBeginnersPage;
import React from 'react';

const MultiplayerTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-green-400">
          Multiplayer Test Page ✅
        </h1>
        <p className="text-xl mb-6">
          If you can see this, the routing is working correctly.
        </p>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Debug Information:</h2>
          <ul className="space-y-2">
            <li>✅ React component rendering</li>
            <li>✅ Tailwind CSS classes working</li>
            <li>✅ Route /multiplayer accessible</li>
            <li>✅ TypeScript compilation successful</li>
          </ul>
        </div>
        
        <div className="mt-8">
          <p className="text-gray-300">
            This is a minimal test component to isolate the blank screen issue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerTest;
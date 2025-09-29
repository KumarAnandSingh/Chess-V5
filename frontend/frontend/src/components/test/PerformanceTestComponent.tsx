import React, { useState } from 'react';
import { getLevelConfig } from '../../config/levelConfig';

// Import the calculation functions from usePerformanceTracking
// We'll recreate them here for testing
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const calculatePerformanceIndex = (input: {
  result: 'win' | 'draw' | 'loss' | 'aborted';
  yourMoves: number;
  parMoves: number;
  avgSecPerMove: number;
  I: number;
  M: number;
  B: number;
  hintsUsed: number;
  undosUsed: number;
}): number => {
  const { result, yourMoves, parMoves, avgSecPerMove, I, M, B, hintsUsed, undosUsed } = input;

  if (result === 'aborted') return 0;

  const resultScore = result === 'win' ? 100 : result === 'draw' ? 60 : 0;
  const qualityScore = Math.max(0, 100 - (B * 25 + M * 10 + I * 5));

  const ratio = parMoves / Math.max(yourMoves, 1);
  const efficiencyScore = clamp(Math.round(100 * Math.pow(ratio, 0.5)), 30, 100);

  let timeScore = 30;
  if (avgSecPerMove <= 8) {
    timeScore = 100;
  } else if (avgSecPerMove <= 20) {
    // Linear interpolation: 100 at 8s, 50 at 20s
    timeScore = Math.round(100 - ((avgSecPerMove - 8) / 12) * 50);
  } else {
    // For >20s: slide 50→30 with proper scaling
    const extraTime = avgSecPerMove - 20;
    const scaleFactor = Math.min(extraTime / 30, 1); // Scale over 30s range
    timeScore = Math.round(50 - (scaleFactor * 20));
  }

  const penalty = hintsUsed * 15 + undosUsed * 10;

  const PI = clamp(
    Math.round(0.5 * resultScore + 0.2 * qualityScore + 0.2 * efficiencyScore + 0.1 * timeScore - penalty),
    0,
    100
  );

  return PI;
};

const starsFromPI = (
  PI: number,
  result: 'win' | 'draw' | 'loss' | 'aborted',
  hintsUsed: number,
  undosUsed: number,
  isBoss: boolean,
  allowAids: boolean = true
): number => {
  if (result === 'aborted') return 0;

  let cap = 3;

  if (allowAids && (hintsUsed > 0 || undosUsed > 0)) {
    cap = Math.min(cap, isBoss ? 1 : 2);
  }

  if (result === 'win' && PI >= 85 && hintsUsed === 0) {
    return Math.min(3, cap);
  }
  if (result === 'win' && PI >= 65) {
    return Math.min(2, cap);
  }
  if ((result === 'win' || result === 'draw') && PI >= 50) {
    return Math.min(1, cap);
  }

  return 0;
};

interface TestCase {
  name: string;
  levelId: number;
  yourMoves: number;
  avgSecPerMove: number;
  I: number;
  M: number;
  B: number;
  hintsUsed: number;
  undosUsed: number;
  result: 'win' | 'draw' | 'loss';
  expectedPI: number;
  expectedStars: number;
}

const TEST_CASES: TestCase[] = [
  {
    name: 'Sanity Check Example',
    levelId: 14,
    yourMoves: 56,
    avgSecPerMove: 9.5,
    I: 2,
    M: 1,
    B: 0,
    hintsUsed: 0,
    undosUsed: 1,
    result: 'win',
    expectedPI: 85,
    expectedStars: 2
  },
  {
    name: 'Perfect Game (No Aids)',
    levelId: 14,
    yourMoves: 52,
    avgSecPerMove: 8.0,
    I: 0,
    M: 0,
    B: 0,
    hintsUsed: 0,
    undosUsed: 0,
    result: 'win',
    expectedPI: 100,
    expectedStars: 3
  },
  {
    name: 'Boss Level with Hint',
    levelId: 5, // Boss level
    yourMoves: 40,
    avgSecPerMove: 10.0,
    I: 1,
    M: 0,
    B: 0,
    hintsUsed: 1,
    undosUsed: 0,
    result: 'win',
    expectedPI: 70, // Should be around this
    expectedStars: 1 // Capped at 1 for boss with aid
  },
  {
    name: 'Regular Level with Hint',
    levelId: 14, // Not a boss level
    yourMoves: 52,
    avgSecPerMove: 8.0,
    I: 0,
    M: 0,
    B: 0,
    hintsUsed: 1,
    undosUsed: 0,
    result: 'win',
    expectedPI: 85, // 100 - 15 penalty
    expectedStars: 2 // Capped at 2 for regular with aid
  }
];

export const PerformanceTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<Array<{
    testCase: TestCase;
    actualPI: number;
    actualStars: number;
    passed: boolean;
  }>>([]);

  const runTests = () => {
    const results = TEST_CASES.map(testCase => {
      const levelConfig = getLevelConfig(testCase.levelId);

      const actualPI = calculatePerformanceIndex({
        result: testCase.result,
        yourMoves: testCase.yourMoves,
        parMoves: levelConfig.parMoves,
        avgSecPerMove: testCase.avgSecPerMove,
        I: testCase.I,
        M: testCase.M,
        B: testCase.B,
        hintsUsed: testCase.hintsUsed,
        undosUsed: testCase.undosUsed
      });

      const actualStars = starsFromPI(
        actualPI,
        testCase.result,
        testCase.hintsUsed,
        testCase.undosUsed,
        levelConfig.boss,
        levelConfig.allowAids
      );

      const passed = actualPI === testCase.expectedPI && actualStars === testCase.expectedStars;

      return {
        testCase,
        actualPI,
        actualStars,
        passed
      };
    });

    setTestResults(results);
  };

  const getBreakdown = (testCase: TestCase) => {
    const levelConfig = getLevelConfig(testCase.levelId);
    const { result, yourMoves, avgSecPerMove, I, M, B, hintsUsed, undosUsed } = testCase;
    const { parMoves } = levelConfig;

    const resultScore = result === 'win' ? 100 : result === 'draw' ? 60 : 0;
    const qualityScore = Math.max(0, 100 - (B * 25 + M * 10 + I * 5));
    const ratio = parMoves / Math.max(yourMoves, 1);
    const efficiencyScore = clamp(Math.round(100 * Math.pow(ratio, 0.5)), 30, 100);

    let timeScore = 30;
    if (avgSecPerMove <= 8) {
      timeScore = 100;
    } else if (avgSecPerMove <= 20) {
      timeScore = Math.round(100 - ((avgSecPerMove - 8) / 12) * 50);
    } else {
      const extraTime = avgSecPerMove - 20;
      const scaleFactor = Math.min(extraTime / 30, 1);
      timeScore = Math.round(50 - (scaleFactor * 20));
    }

    const penalty = hintsUsed * 15 + undosUsed * 10;

    return {
      resultScore,
      qualityScore,
      efficiencyScore,
      timeScore,
      penalty,
      ratio: ratio.toFixed(3),
      parMoves
    };
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Performance Tracking Test Suite</h1>

      <button
        onClick={runTests}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Run Tests
      </button>

      <div className="space-y-6">
        {testResults.map((result, index) => {
          const breakdown = getBreakdown(result.testCase);
          const levelConfig = getLevelConfig(result.testCase.levelId);

          return (
            <div
              key={index}
              className={`p-4 border-2 rounded-lg ${
                result.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{result.testCase.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.passed ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {result.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Test Input:</h4>
                  <div className="text-sm space-y-1">
                    <div>Level: {result.testCase.levelId} (Par: {levelConfig.parMoves}, Boss: {levelConfig.boss ? 'Yes' : 'No'})</div>
                    <div>Result: {result.testCase.result}</div>
                    <div>Your Moves: {result.testCase.yourMoves}</div>
                    <div>Avg Time/Move: {result.testCase.avgSecPerMove}s</div>
                    <div>Errors: I={result.testCase.I}, M={result.testCase.M}, B={result.testCase.B}</div>
                    <div>Aids: Hints={result.testCase.hintsUsed}, Undos={result.testCase.undosUsed}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Calculation Breakdown:</h4>
                  <div className="text-sm space-y-1">
                    <div>Result Score: {breakdown.resultScore}</div>
                    <div>Quality Score: {breakdown.qualityScore}</div>
                    <div>Efficiency Score: {breakdown.efficiencyScore} (ratio: {breakdown.ratio})</div>
                    <div>Time Score: {breakdown.timeScore}</div>
                    <div>Penalty: -{breakdown.penalty}</div>
                    <div>Final PI: 0.5×{breakdown.resultScore} + 0.2×{breakdown.qualityScore} + 0.2×{breakdown.efficiencyScore} + 0.1×{breakdown.timeScore} - {breakdown.penalty}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Expected Results:</h4>
                  <div className="text-sm">
                    <div>PI: {result.testCase.expectedPI}</div>
                    <div>Stars: {result.testCase.expectedStars}★</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Actual Results:</h4>
                  <div className="text-sm">
                    <div className={result.actualPI === result.testCase.expectedPI ? 'text-green-600' : 'text-red-600'}>
                      PI: {result.actualPI} {result.actualPI !== result.testCase.expectedPI && `(expected: ${result.testCase.expectedPI})`}
                    </div>
                    <div className={result.actualStars === result.testCase.expectedStars ? 'text-green-600' : 'text-red-600'}>
                      Stars: {result.actualStars}★ {result.actualStars !== result.testCase.expectedStars && `(expected: ${result.testCase.expectedStars}★)`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {testResults.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Test Summary:</h3>
          <div className="text-sm">
            Passed: {testResults.filter(r => r.passed).length}/{testResults.length}
          </div>
        </div>
      )}
    </div>
  );
};
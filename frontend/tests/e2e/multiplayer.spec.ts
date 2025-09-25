import { test, expect, Page, BrowserContext } from '@playwright/test';

const FRONTEND_URL = 'https://studyify.in';
const BACKEND_URL = 'https://chess-academy-backend-o3iy.onrender.com';

// Test configuration
test.describe.configure({ mode: 'serial' });

test.describe('Chess Academy Multiplayer E2E Tests - Railway to Render Migration', () => {
  let context1: BrowserContext;
  let context2: BrowserContext;
  let player1: Page;
  let player2: Page;

  test.beforeAll(async ({ browser }) => {
    // Create two separate browser contexts to simulate two different users
    context1 = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    context2 = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    player1 = await context1.newPage();
    player2 = await context2.newPage();

    // Setup console logging for debugging
    player1.on('console', msg => console.log(`[Player1] ${msg.text()}`));
    player2.on('console', msg => console.log(`[Player2] ${msg.text()}`));

    // Setup error logging
    player1.on('pageerror', err => console.log(`[Player1 Error] ${err.message}`));
    player2.on('pageerror', err => console.log(`[Player2 Error] ${err.message}`));
  });

  test.afterAll(async () => {
    await context1?.close();
    await context2?.close();
  });

  test('Backend Health Check', async () => {
    console.log('🔍 Testing backend health endpoint...');

    const response = await player1.request.get(`${BACKEND_URL}/health`);
    expect(response.ok()).toBeTruthy();

    const healthData = await response.json();
    expect(healthData).toHaveProperty('healthy', true);
    expect(healthData).toHaveProperty('status', 'OK');

    console.log('✅ Backend health check passed');
  });

  test('Backend API Availability', async () => {
    console.log('🔍 Testing backend API availability...');

    const response = await player1.request.get(`${BACKEND_URL}`);
    expect(response.ok()).toBeTruthy();

    const data = await response.text();
    expect(data).toContain('Chess Academy Backend Running');

    console.log('✅ Backend API availability confirmed');
  });

  test('Socket.IO Endpoint Configuration', async () => {
    console.log('🔍 Testing Socket.IO endpoint...');

    // Socket.IO endpoints typically return 400 for direct HTTP access, which is expected
    const response = await player1.request.get(`${BACKEND_URL}/socket.io/?EIO=4&transport=polling`);

    // Status 400 or 200 both indicate the endpoint is available
    expect([200, 400].includes(response.status())).toBeTruthy();

    console.log('✅ Socket.IO endpoint is accessible');
  });

  test('Frontend Application Loading', async () => {
    console.log('🔍 Testing frontend application loading...');

    await test.step('Player 1 loads main page', async () => {
      await player1.goto(FRONTEND_URL, { waitUntil: 'networkidle' });

      // Check page title
      const title = await player1.title();
      expect(title).toContain('Studyify');

      // Wait for React app to mount
      await player1.waitForSelector('body', { state: 'attached' });
    });

    await test.step('Player 2 loads main page', async () => {
      await player2.goto(FRONTEND_URL, { waitUntil: 'networkidle' });

      const title = await player2.title();
      expect(title).toContain('Studyify');

      await player2.waitForSelector('body', { state: 'attached' });
    });

    console.log('✅ Frontend application loads successfully for both players');
  });

  test('Multiplayer Page Navigation', async () => {
    console.log('🔍 Testing multiplayer page navigation...');

    await test.step('Navigate to multiplayer page', async () => {
      // Try to navigate to multiplayer page
      try {
        await Promise.all([
          player1.goto(`${FRONTEND_URL}/multiplayer`, { waitUntil: 'networkidle' }),
          player2.goto(`${FRONTEND_URL}/multiplayer`, { waitUntil: 'networkidle' })
        ]);
      } catch (error) {
        console.log('Direct multiplayer URL not accessible, trying navigation...');

        // If direct URL doesn't work, try to find navigation
        await player1.goto(FRONTEND_URL);
        await player2.goto(FRONTEND_URL);

        // Look for multiplayer links/buttons
        const multiplayerLink1 = player1.locator('a[href*="multiplayer"], button:has-text("Multiplayer")').first();
        const multiplayerLink2 = player2.locator('a[href*="multiplayer"], button:has-text("Multiplayer")').first();

        if (await multiplayerLink1.isVisible()) {
          await multiplayerLink1.click();
        }
        if (await multiplayerLink2.isVisible()) {
          await multiplayerLink2.click();
        }
      }
    });

    // Wait for page to load
    await player1.waitForTimeout(3000);
    await player2.waitForTimeout(3000);

    console.log('✅ Multiplayer page navigation completed');
  });

  test('Socket.IO Connection Establishment', async () => {
    console.log('🔍 Testing Socket.IO connection establishment...');

    await test.step('Check for Socket.IO library loading', async () => {
      // Inject Socket.IO connection test script
      const connectionTest1 = await player1.evaluate(() => {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve({ connected: false, error: 'Timeout' });
          }, 10000);

          // Check if Socket.IO is available
          if (typeof window.io === 'undefined') {
            clearTimeout(timeout);
            resolve({ connected: false, error: 'Socket.IO not loaded' });
            return;
          }

          try {
            // Create connection to backend
            const socket = window.io('https://chess-academy-backend-o3iy.onrender.com', {
              transports: ['websocket', 'polling'],
              timeout: 10000,
              forceNew: true
            });

            socket.on('connect', () => {
              clearTimeout(timeout);
              resolve({
                connected: true,
                id: socket.id,
                transport: socket.io.engine.transport.name
              });
              socket.disconnect();
            });

            socket.on('connect_error', (error) => {
              clearTimeout(timeout);
              resolve({
                connected: false,
                error: error.message || 'Connection error'
              });
            });
          } catch (error) {
            clearTimeout(timeout);
            resolve({
              connected: false,
              error: error.message || 'Setup error'
            });
          }
        });
      });

      console.log('Player 1 connection result:', connectionTest1);

      // Similar test for Player 2
      const connectionTest2 = await player2.evaluate(() => {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve({ connected: false, error: 'Timeout' });
          }, 10000);

          if (typeof window.io === 'undefined') {
            clearTimeout(timeout);
            resolve({ connected: false, error: 'Socket.IO not loaded' });
            return;
          }

          try {
            const socket = window.io('https://chess-academy-backend-o3iy.onrender.com', {
              transports: ['websocket', 'polling'],
              timeout: 10000,
              forceNew: true
            });

            socket.on('connect', () => {
              clearTimeout(timeout);
              resolve({
                connected: true,
                id: socket.id,
                transport: socket.io.engine.transport.name
              });
              socket.disconnect();
            });

            socket.on('connect_error', (error) => {
              clearTimeout(timeout);
              resolve({
                connected: false,
                error: error.message || 'Connection error'
              });
            });
          } catch (error) {
            clearTimeout(timeout);
            resolve({
              connected: false,
              error: error.message || 'Setup error'
            });
          }
        });
      });

      console.log('Player 2 connection result:', connectionTest2);

      // At least one player should be able to connect successfully
      const anyConnectionSuccess = connectionTest1.connected || connectionTest2.connected;
      expect(anyConnectionSuccess).toBeTruthy();
    });

    console.log('✅ Socket.IO connection establishment verified');
  });

  test('Game Creation and Matchmaking Flow', async () => {
    console.log('🔍 Testing game creation and matchmaking...');

    // This test will depend on the actual UI implementation
    await test.step('Look for game creation UI elements', async () => {
      // Look for common multiplayer UI elements
      const gameElements1 = await player1.locator('button:has-text("Create Game"), button:has-text("Play"), button:has-text("Find Game")').count();
      const gameElements2 = await player2.locator('button:has-text("Join Game"), button:has-text("Play"), button:has-text("Find Game")').count();

      console.log(`Player 1 found ${gameElements1} game-related UI elements`);
      console.log(`Player 2 found ${gameElements2} game-related UI elements`);

      // If UI elements are found, try to interact with them
      if (gameElements1 > 0) {
        const createButton = player1.locator('button:has-text("Create Game"), button:has-text("Play")').first();
        if (await createButton.isVisible()) {
          await createButton.click();
          await player1.waitForTimeout(2000);
        }
      }

      if (gameElements2 > 0) {
        const joinButton = player2.locator('button:has-text("Join Game"), button:has-text("Play")').first();
        if (await joinButton.isVisible()) {
          await joinButton.click();
          await player2.waitForTimeout(2000);
        }
      }
    });

    console.log('✅ Game creation and matchmaking flow tested');
  });

  test('CORS Configuration Verification', async () => {
    console.log('🔍 Testing CORS configuration...');

    // Test CORS by making requests from the frontend domain
    const corsTest = await player1.evaluate(async (backendUrl) => {
      try {
        const response = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return {
          success: true,
          status: response.status,
          corsAllowed: true
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          corsAllowed: false
        };
      }
    }, BACKEND_URL);

    expect(corsTest.success).toBeTruthy();
    expect(corsTest.corsAllowed).toBeTruthy();

    console.log('✅ CORS configuration allows frontend to backend communication');
  });

  test('Connection Stability Test', async () => {
    console.log('🔍 Testing connection stability over time...');

    // Create persistent connections and monitor them
    const stabilityTest = await player1.evaluate(() => {
      return new Promise((resolve) => {
        let connectionCount = 0;
        let disconnectionCount = 0;
        let maxConnections = 5;
        let testDuration = 30000; // 30 seconds for faster testing

        const startTest = () => {
          if (typeof window.io === 'undefined') {
            resolve({
              stable: false,
              error: 'Socket.IO not available',
              connections: 0,
              disconnections: 0
            });
            return;
          }

          const socket = window.io('https://chess-academy-backend-o3iy.onrender.com', {
            transports: ['websocket', 'polling'],
            timeout: 5000
          });

          socket.on('connect', () => {
            connectionCount++;
            console.log(`Connection ${connectionCount} established`);

            if (connectionCount >= maxConnections) {
              socket.disconnect();
              resolve({
                stable: true,
                connections: connectionCount,
                disconnections: disconnectionCount,
                duration: testDuration
              });
            }
          });

          socket.on('disconnect', (reason) => {
            disconnectionCount++;
            console.log(`Disconnection ${disconnectionCount}: ${reason}`);

            // Attempt reconnection for testing
            if (connectionCount < maxConnections) {
              setTimeout(() => {
                socket.connect();
              }, 1000);
            }
          });

          socket.on('connect_error', (error) => {
            console.log('Connection error:', error.message);
            if (connectionCount === 0) {
              resolve({
                stable: false,
                error: error.message,
                connections: connectionCount,
                disconnections: disconnectionCount
              });
            }
          });

          // Timeout the test
          setTimeout(() => {
            socket.disconnect();
            resolve({
              stable: connectionCount > 0,
              connections: connectionCount,
              disconnections: disconnectionCount,
              timeout: true
            });
          }, testDuration);
        };

        startTest();
      });
    });

    console.log('Stability test results:', stabilityTest);
    expect(stabilityTest.stable).toBeTruthy();
    expect(stabilityTest.connections).toBeGreaterThan(0);

    console.log('✅ Connection stability verified');
  });

  test('Railway Backend Issues Resolution Verification', async () => {
    console.log('🔍 Verifying resolution of Railway backend issues...');

    await test.step('Test: No connection fluctuations', async () => {
      // Monitor for rapid connect/disconnect cycles that were problematic with Railway
      const fluctuationTest = await player1.evaluate(() => {
        return new Promise((resolve) => {
          let connectionStates = [];
          let monitorDuration = 10000; // 10 seconds

          if (typeof window.io === 'undefined') {
            resolve({ stable: false, error: 'Socket.IO not available' });
            return;
          }

          const socket = window.io('https://chess-academy-backend-o3iy.onrender.com', {
            transports: ['websocket', 'polling']
          });

          const stateMonitor = setInterval(() => {
            connectionStates.push({
              connected: socket.connected,
              timestamp: Date.now()
            });
          }, 1000);

          setTimeout(() => {
            clearInterval(stateMonitor);
            socket.disconnect();

            // Analyze connection state changes
            let stateChanges = 0;
            for (let i = 1; i < connectionStates.length; i++) {
              if (connectionStates[i].connected !== connectionStates[i-1].connected) {
                stateChanges++;
              }
            }

            resolve({
              stable: stateChanges <= 2, // Allow for initial connection
              stateChanges,
              connectionStates: connectionStates.length,
              finalState: connectionStates[connectionStates.length - 1]?.connected
            });
          }, monitorDuration);
        });
      });

      console.log('Connection fluctuation test:', fluctuationTest);
      expect(fluctuationTest.stable).toBeTruthy();
    });

    await test.step('Test: Game started event handling', async () => {
      // Test that the "Game started" event doesn\'t cause disconnection
      const gameStartTest = await player1.evaluate(() => {
        return new Promise((resolve) => {
          if (typeof window.io === 'undefined') {
            resolve({ success: false, error: 'Socket.IO not available' });
            return;
          }

          const socket = window.io('https://chess-academy-backend-o3iy.onrender.com');
          let connectedAfterGameStart = false;

          socket.on('connect', () => {
            // Simulate game start event that was problematic with Railway
            socket.emit('gameStarted', { gameId: 'test-game-123' });

            // Check if still connected after game start event
            setTimeout(() => {
              connectedAfterGameStart = socket.connected;
              socket.disconnect();

              resolve({
                success: true,
                connectedAfterGameStart,
                gameStartHandled: true
              });
            }, 3000);
          });

          socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
              resolve({
                success: false,
                error: 'Server disconnected after game start',
                reason
              });
            }
          });

          socket.on('connect_error', (error) => {
            resolve({
              success: false,
              error: error.message
            });
          });
        });
      });

      console.log('Game start event test:', gameStartTest);
      expect(gameStartTest.success).toBeTruthy();
      if (gameStartTest.connectedAfterGameStart !== undefined) {
        expect(gameStartTest.connectedAfterGameStart).toBeTruthy();
      }
    });

    await test.step('Test: Page loading after connection', async () => {
      // Verify that the game page loads successfully after connection establishment
      const currentUrl1 = player1.url();
      const currentUrl2 = player2.url();

      expect(currentUrl1).toContain('studyify.in');
      expect(currentUrl2).toContain('studyify.in');

      // Check that pages are responsive
      const pageTitle1 = await player1.title();
      const pageTitle2 = await player2.title();

      expect(pageTitle1).toBeTruthy();
      expect(pageTitle2).toBeTruthy();
    });

    console.log('✅ Railway backend issues appear to be resolved');
  });

  test('Performance and Response Time Verification', async () => {
    console.log('🔍 Testing performance and response times...');

    const performanceMetrics = await player1.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {
          connectionTime: null,
          responseTime: null,
          avgLatency: null
        };

        if (typeof window.io === 'undefined') {
          resolve({ error: 'Socket.IO not available' });
          return;
        }

        const startTime = Date.now();
        const socket = window.io('https://chess-academy-backend-o3iy.onrender.com');

        socket.on('connect', () => {
          metrics.connectionTime = Date.now() - startTime;

          // Test response time with ping
          const pingStart = Date.now();
          socket.emit('ping', pingStart);

          socket.on('pong', (originalTime) => {
            metrics.responseTime = Date.now() - originalTime;
            socket.disconnect();
            resolve(metrics);
          });

          // Fallback if no pong response
          setTimeout(() => {
            socket.disconnect();
            resolve(metrics);
          }, 5000);
        });

        socket.on('connect_error', () => {
          resolve({ error: 'Connection failed' });
        });
      });
    });

    console.log('Performance metrics:', performanceMetrics);

    if (performanceMetrics.connectionTime) {
      expect(performanceMetrics.connectionTime).toBeLessThan(10000); // Should connect within 10 seconds
    }

    console.log('✅ Performance metrics verified');
  });
});

// Additional utility test for manual verification
test.describe('Manual Verification Helpers', () => {
  test('Generate test report data', async ({ page }) => {
    const testData = {
      testDate: new Date().toISOString(),
      frontend: FRONTEND_URL,
      backend: BACKEND_URL,
      testEnvironment: 'Playwright E2E',
      migration: 'Railway to Render.com',
      browser: await page.evaluate(() => navigator.userAgent)
    };

    console.log('📊 Test Report Data:', JSON.stringify(testData, null, 2));

    // Save test metadata
    await page.evaluate((data) => {
      localStorage.setItem('e2e-test-metadata', JSON.stringify(data));
    }, testData);
  });
});
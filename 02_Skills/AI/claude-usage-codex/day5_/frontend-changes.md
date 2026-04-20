# Frontend Changes

## Date: 2026-04-20

## Summary

Added a Snake game page and a frontend monitoring SDK.

---

## Files Modified/Created

### 1. `index.html` (Modified)
- Added navigation link to snake game (`<a href="snake-game.html">贪吃蛇游戏</a>`)

### 2. `snake-game.html` (New)
Complete Snake game implementation with:
- **Controls**: Keyboard (Arrow keys/WASD) + Mobile direction buttons
- **Features**:
  - Score tracking with localStorage for high score persistence
  - Pause/Resume functionality
  - Game Over modal with restart option
  - Gradient snake body with eyes animation
  - Responsive design for mobile devices
- **Technical Details**:
  - Canvas-based rendering
  - Configurable grid size and speed
  - Collision detection (walls/self)

### 3. `utils/monitor.js` (New)
Frontend User Behavior Monitoring SDK featuring:
- **Error Tracking**: Runtime errors, unhandled rejections, resource load failures
- **Click Tracking**: Element selector, position data
- **Performance Metrics**: LCP, FID, CLS via PerformanceObserver
- **Page Views**: Load time measurement
- **Batch Reporting**: Configurable batch size and flush interval using `sendBeacon`
- **Custom Events**: API via `window.Monitor.track(eventName, extra)`

---

## Key Features

| Feature | Description |
|---------|-------------|
| Snake Game | Classic arcade game with modern UI |
| Monitor SDK | RUM (Real User Monitoring) solution |
| High Score | Persisted in localStorage |
| Responsive | Works on desktop and mobile |

---

## How to Use

### Play the Game
1. Open `snake-game.html` in a browser
2. Click "开始游戏" or press any direction key
3. Use Arrow keys or WASD to control the snake
4. Eat red food to gain points
5. Avoid walls and your own tail

### Use the Monitor SDK
```javascript
// Custom event tracking
window.Monitor.track('button_click', { buttonId: 'buy' });
```

---

## Future Improvements

- [ ] Add sound effects
- [ ] Implement difficulty levels
- [ ] Add leaderboard via backend
- [ ] Configure Monitor SDK report URL
- [ ] Add A/B testing support

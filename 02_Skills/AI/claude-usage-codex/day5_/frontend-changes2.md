# Frontend Changes 2

## Date: 2026-04-20

---

## Summary

Added a Jumping Bug (Endless Runner) game page.

---

## Files Modified/Created

### 1. `index.html` (Modified)
- Added navigation link to jumping bug game (`<a href="jumping-bug-game.html">跳跳虫游戏</a>`)

### 2. `jumping-bug-game.html` (New)
Endless runner style game with:
- **Controls**: Click anywhere on canvas, Space key, or Up Arrow to jump
- **Features**:
  - Progressive difficulty (obstacles spawn faster as score increases)
  - Gravity-based physics for smooth jumping
  - Animated cloud parallax background
  - Grass animation on ground
  - Score tracking with localStorage high score persistence
- **Technical Details**:
  - Canvas-based rendering
  - Circle-rectangle collision detection
  - Frame-count based animations
  - Configurable gravity, jump force, and obstacle speed

---

## Game Mechanics

| Feature | Description |
|---------|-------------|
| Jump Physics | Velocity + Gravity system for natural arc |
| Obstacle Spawning | Random heights, dynamic speed scaling |
| Scoring | +10 points per obstacle passed |
| Difficulty | Increases every 100 points (faster obstacles, more frequent spawns) |
| High Score | Persisted in localStorage (`bugJumpHighScore`) |

---

## Controls

| Input | Action |
|-------|--------|
| Click/Tap | Jump |
| Space | Jump / Start Game |
| Up Arrow | Jump |

---

## How to Play

1. Open `jumping-bug-game.html` in a browser
2. Click "开始游戏" or press Space/Up Arrow
3. Click/tap the game area or press keys to make the bug jump
4. Avoid hitting the pink obstacles rising from the ground
5. Each obstacle passed = 10 points
6. Game gets harder as your score increases!

---

## Visual Elements

- **Bug Character**: Red oval body with animated rotation in air, eyes, antennae
- **Obstacles**: Pink rectangular blocks with decorative tops
- **Background**: Blue sky gradient with moving clouds (parallax effect)
- **Ground**: Green grass with animated blades that sway

---

## Future Improvements

- [ ] Add power-ups (double jump, shield)
- [ ] Implement multiple character skins
- [ ] Add sound effects
- [ ] Create local leaderboard
- [ ] Add combo system for consecutive jumps
- [ ] Introduce different obstacle types

---

## Comparison with Snake Game

| Aspect | Snake Game | Bug Jump Game |
|--------|------------|---------------|
| Genre | Classic arcade | Endless runner |
| Controls | 4-directional movement | Single action (jump) |
| Gameplay | Avoid self & walls | Dodge rising obstacles |
| Difficulty | Static speed | Progressive scaling |
| Physics | Grid-based | Velocity/gravity-based |

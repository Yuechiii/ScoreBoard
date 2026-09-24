# Billiard Scoreboard

Static HTML/CSS/JavaScript billiard scoreboard with JSON-only persistence.

## Run
Open `index.html` in Chrome or Edge.

## Storage
There is no database and no server.
- **Save JSON** saves the entire scoreboard, player photos, scores, rounds, and winner history to a `.json` file.
- **Load JSON** restores a previous scoreboard.
- Player photos are embedded as Base64 data inside the JSON file, so the JSON is the only persistent file.

Chrome/Edge support the Save File Picker. Other browsers use a normal JSON download.

## Controls
- `+1 / -1`: adjust score.
- `+ ROUND WIN`: immediately records a round winner in history.
- `NEXT ROUND`: asks which player won and records the round.
- `Undo Last Round`: removes the most recent round record.
- `Reset Match`: resets scores and round counters but keeps history.
- `Clear History`: removes all winner history.

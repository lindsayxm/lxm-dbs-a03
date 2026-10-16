# The Observer Effect: User Flows

**Main task, as one sentence:**

> I pick an outcome and wager tokens → it's in my open predictions → I come back tomorrow, my +10 tokens are waiting, and the events that closed have *collapsed* into wins or losses.

## Flow diagram

```mermaid
flowchart TD
    Start(["Open the site"]) --> Saved{"Anything saved<br/>on this device?"}

    %% 1. First visit
    subgraph FIRST["1 · First visit: useful right away"]
        Home["/ Observe<br/>'You have 100 tokens.<br/>What happens next?'<br/>+ event list"]
        Filter["Filter by category<br/>Sports · Politics · World<br/>Markets · Culture · Science"]
        Home --> Filter --> Home
    end

    %% 2. Main task
    subgraph TASK["2 · Main task: make a prediction"]
        Event["/events/[id]<br/>Pick an outcome<br/>Enter a wager"]
        Check{"Valid?"}
        Err["Error next to the field<br/>· Choose an outcome to predict.<br/>· Enter a whole number of tokens, like 10.<br/>· You have 85 tokens. Wager 85 or less.<br/>(what you typed is kept)"]
        Closed["'This event has closed.<br/>Pick another one.'"]
        Event --> Check
        Check -- No --> Err --> Event
        Event -. event already closed .-> Closed
    end

    %% 3. On my list
    subgraph LIST["3 · It's on my list"]
        Preds["/predictions<br/>Open · Resolved<br/>toast: 'Prediction placed'"]
        FirstPick{"First prediction<br/>and no username?"}
        Claim["/claim<br/>'Claim your spot on<br/>the leaderboard'"]
        ClaimCheck{"Valid and<br/>not taken?"}
        ClaimErr["Error next to the field<br/>· Use 3–20 letters, numbers, or underscores.<br/>· quark_42 is taken by a rival. Try another."]
        Preds --> FirstPick
        FirstPick -- Yes --> Claim --> ClaimCheck
        ClaimCheck -- No --> ClaimErr --> Claim
    end

    %% 4. Coming back
    subgraph BACK["4 · Coming back: it remembers"]
        Visit["On load:<br/>daily streak bonus<br/>(+10 → +25)<br/>settle events that closed"]
        Report["/report: collapse report<br/>'Welcome back. 2 won, 1 lost.<br/>+20 daily tokens'"]
        Board["/leaderboard<br/>This month's most right<br/>Top 3 win the prize"]
        Panel["/ home: 'Welcome back.<br/>Since you last observed…' panel"]
        Visit --> Panel -- See your report --> Report --> Board
    end

    Saved -- No --> Home
    Saved -- Yes --> Visit
    Visit -- nothing new --> Home
    Panel --> Home
    Home -- tap an event --> Event
    Check -- Yes --> Preds
    FirstPick -- No --> Home
    ClaimCheck -- Yes --> Board
    Report -- make new predictions --> Home
    Board --> Home
    Closed --> Home
```

## Screens (one route per step, with shared navigation)

| Step | Route | Purpose |
|---|---|---|
| First visit | `/` | Tokens up front, events to pick from immediately. No empty screen. |
| Main task | `/events/[id]` | One-column form: outcome + wager, with inline errors. |
| On my list | `/predictions` | Open and resolved predictions. |
| Claim name | `/claim` | Username (after the first prediction, not before). |
| Coming back | `/report` | What happened since you last observed. |
| Reason to return | `/leaderboard` | Monthly ranking. The top 3 win cash. |

**Navigation:** a top bar on every page with Observe · My predictions · Leaderboard, the token balance, and your name (or "Claim name"). The current page is highlighted (`aria-current`). Event pages link back to the filtered list you came from.

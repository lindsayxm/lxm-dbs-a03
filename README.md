# The Observer Effect

*Nothing is decided until you observe it.*

A prediction game: pick what you think will happen in sports, politics, world news, markets, culture, and science, and wager tokens on it. If you're right, you win 2× your wager. If you're wrong, you lose it. You start with 100 tokens and get a daily bonus that grows from +10 to +25 the more days in a row you come back. Each month, the three people who were **most right** win a cash prize. Nobody ever risks their own money; the site is ad-supported.

Built for MPCS 51238 *Design, Build, Ship*, Assignment 3: Patterns & Flows.

- **Live:** _coming soon (Vercel)_
- **Stack:** Next.js + Tailwind CSS. Data is saved in your browser (`localStorage`), with no accounts or database.

## Main flow

> I pick an outcome and wager tokens → it's in my open predictions → I come back tomorrow, my +10 tokens are waiting, and the events that closed have *collapsed* into wins or losses.

```mermaid
flowchart TD
    Start(["Open the site"]) --> Saved{"Anything saved<br/>on this device?"}

    subgraph FIRST["1 · First visit: useful right away"]
        Home["/ Observe<br/>'You have 100 tokens.<br/>What happens next?'<br/>+ event list"]
        Filter["Filter by category<br/>Sports · Politics · World<br/>Markets · Culture · Science"]
        Home --> Filter --> Home
    end

    subgraph TASK["2 · Main task: make a prediction"]
        Event["/events/[id]<br/>Pick an outcome<br/>Enter a wager"]
        Check{"Valid?"}
        Err["Error next to the field<br/>· Choose an outcome to predict.<br/>· Enter a whole number of tokens, like 10.<br/>· You have 85 tokens. Wager 85 or less.<br/>(what you typed is kept)"]
        Closed["'This event has closed.<br/>Pick another one.'"]
        Event --> Check
        Check -- No --> Err --> Event
        Event -. event already closed .-> Closed
    end

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

    subgraph BACK["4 · Coming back: it remembers"]
        Visit["On load:<br/>daily streak bonus<br/>(+10 → +25)<br/>settle events that closed"]
        Report["/report: collapse report<br/>'Welcome back. 2 won, 1 lost.<br/>+20 daily tokens'"]
        Board["/leaderboard<br/>This month's most right<br/>Top 3 win the prize"]
        Visit --> Report --> Board
    end

    Saved -- No --> Home
    Saved -- Yes --> Visit
    Visit -- nothing new --> Home
    Home -- tap an event --> Event
    Check -- Yes --> Preds
    FirstPick -- No --> Home
    ClaimCheck -- Yes --> Board
    Report -- make new predictions --> Home
    Board --> Home
    Closed --> Home
```

The diagram is also in [`flows.md`](flows.md), along with a table of screens and routes.

## Onboarding research

We studied how **Manifold Markets**, **Metaculus**, and **ESPN Pick'em/Streak** welcome someone new. All three require an account before your first prediction. We don't: you predict first and claim a name afterward. What we borrowed:

- **The balance is the headline** (Manifold): "You have 100 tokens. What happens next?"
- **A crowd anchor** (Metaculus): every event shows what the crowd thinks, so your first guess isn't made blind.
- **Fast first feedback** (a lesson from Metaculus's slow resolutions): some events close within a day.
- **A growing daily streak** (Manifold): +10, +15, +20, up to +25 tokens for coming back on consecutive days.
- **A "while you were away" report** (Metaculus's resolution email): what resolved, what you won, what you lost.
- **An honest prize facts strip** (ESPN): free to play, top 3 win cash monthly, you never risk money.

Full notes and sources: [`research.md`](research.md).

## First-run check

_Coming after deployment: an agent tries the live site as a brand-new user and gives usability feedback._

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. To test the "coming back" flow without waiting a day, use **Simulate tomorrow** in the footer.

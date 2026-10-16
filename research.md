# Onboarding Research

How do three similar tools welcome someone new? For each one, we looked at the first screen, what it asks for, and how soon you get something useful. Three subagents researched these in parallel, using public pages, help docs, and (for Manifold and Metaculus) their open-source code. They didn't create accounts. Anything marked *unverified* couldn't be confirmed.

## At a glance

| | Manifold Markets | Metaculus | ESPN Pick'em / Streak |
|---|---|---|---|
| **What it is** | Play-money prediction market | Forecasting platform (probabilities) | Free sports picks, cash prizes |
| **First screen** | Browse markets + "Sign up — Get Ṁ1,000 to start trading!" | Hero + live stats, topic chips, popular-question carousel | Prize banner ("$1,500 every week"), facts strip, "Make Picks" |
| **Asks for before first prediction** | Account, then a 5-step welcome modal (name, how it works, interests, verification), all skippable | Account (+ email confirm), then a 5-step tutorial | ESPN account; entry name auto-filled; groups optional |
| **Steps to first prediction** | ~3 (sign up → modal → bet) | ~5 (the tutorial *is* the first forecasts) | ~3–4 (open → log in → entry → pick) |
| **Starting reward** | Ṁ1,000, plus a daily streak bonus (Ṁ5 rising to Ṁ25/day) | None; scores only after questions resolve | None; prizes for top players |
| **Return hooks** | Streaks, monthly leagues (promotion and relegation), daily quests, resolution alerts | "Your question resolved" email with your score vs. the crowd, track record, leaderboards with medals | Weekly and monthly prizes, streaks with HOT/COLD animations, "Beat the Expert", leaderboards |

## Manifold Markets
- **First screen:** browsable while logged out. The sign-up button leads with the reward: "Get Ṁ1,000 to start trading!"
- **Asks for:** an account first, then a 5-page welcome modal (name, how it works, interests, identity verification). Every page can be skipped, and interests are pre-selected from what you've viewed.
- **Time to value:** about 3 steps, but the account wall comes before any prediction.
- **Return hooks:** a daily prediction streak that grows from Ṁ5 to Ṁ25/day, monthly leagues of 25–100 people with promotion, and daily and weekly quests.
- **Takeaway:** put the starting balance in the headline. The growing, capped streak is a strong daily hook.
- **Avoid:** front-loading pages before the first bet. A new user said the help docs were hard to find.
- Sources: [manifold.markets](https://manifold.markets/), [FAQ](https://docs.manifold.markets/faq), [onboarding code](https://github.com/manifoldmarkets/manifold/blob/main/web/components/onboarding/welcome.tsx), [leagues](https://manifold.markets/community-guidelines/leagues)

## Metaculus
- **First screen:** "Collective intelligence for the public good", with live counts, topic chips and a carousel of popular questions. The main action is to browse.
- **Asks for:** an account, then a tutorial that opens automatically (closing it hides it for 24h using localStorage). The first step asks you to pick a topic.
- **Time to value:** the tutorial *is* your first forecasts, on real questions. It shows the crowd's % with a word label ("Likely"), and you answer "Less likely / About right / More likely". That pre-sets a slider you can then adjust.
- **Return hooks:** an email when a question you predicted resolves, with your score vs. the community. Also a track record with calibration, and leaderboards with medals.
- **Takeaway:** anchor a first guess on the crowd number. A "your predictions resolved" summary is the best return moment.
- **Avoid:** making people wait. Questions can take months to resolve, so a newcomer gets no feedback for a long time.
- Sources: [Metaculus repo](https://github.com/Metaculus/metaculus) (the live site blocked automated fetches), [quickstart mirror](https://mintlify.wiki/Metaculus/metaculus/quickstart)

## ESPN Pick'em / Streak
- **First screen:** a prize banner up front ("$1,500 in guaranteed prizes… EVERY WEEK"), then a facts strip (prizes, lock rule, dates, Official Rules link), and tabs for Make Picks / My Entries / Groups / Leaderboard.
- **Asks for:** an ESPN account. The entry name is filled in automatically and groups are optional. The older Streak game had "no league to join or manage": you just picked a matchup.
- **Time to value:** about 3–4 steps (inferred). Streak was one tap per pick.
- **Return hooks:** weekly and monthly prizes, HOT/COLD streak animations, "Beat the Expert" against a named ESPN personality, and push alerts when your next pick opens.
- **Takeaway:** state prize facts plainly and briefly. A named benchmark gives you a target when you come back.
- **Avoid:** an account wall before the first pick. *Unverified:* whether Streak still runs in 2026, and the exact current signup screens.
- Sources: [NFL Pick'em 2026](https://fantasy.espn.com/games/nfl-pickem-2026/make-picks), [ESPN Streak launch](https://espnpressroom.com/press-release/espn-launches-new-streak-inside-espn-fantasy-app/), [RotoBaller guide](https://www.rotoballer.com/rotoballers-nfl-pickem-pool-challenge-free-football-pick-em-contest-on-espn/)

## What all three get wrong (for us)
All three put an **account wall before the first prediction**. We don't have accounts, and the brief wants something useful on the first visit, so our newcomer can make a prediction before giving us anything.

## What we'll use in our first visit

1. **No wall: predict first, name later** (the opposite of all three, closest to ESPN Streak). Land on events with tokens ready. The username is asked for *after* the first prediction, framed as "claim your spot on the leaderboard."
2. **The balance is the headline** (Manifold). "You have **100 tokens**. What happens next?" sits at the top of the first screen.
3. **Crowd anchor** (Metaculus). Each event shows a seeded "crowd says" split with a word label ("Crowd: 64% · Likely"), so a newcomer has a reference point and doesn't stare at a blank choice.
4. **Fast first feedback** (Metaculus's lesson). Some seeded events close within the first day, and the home page shows "Next collapse in 5h 12m", so the first return has results waiting.
5. **"While you were away" collapse report** (Metaculus resolution email). `/report` and the home panel show what resolved, won or lost, and the net tokens.
6. **Honest prize facts strip** (ESPN). A short line on the leaderboard and home page: "Top 3 each month win cash · Free to play · You never risk money · Rules". It also says plainly that prize claims will need verification once accounts launch, since scores stored on one device can't be verified.

**Considered for later:** a Manifold-style *growing* daily bonus (+10, rising to a cap, for consecutive days) instead of a flat +10, and an ESPN-style "Beat the Expert" rival on the leaderboard.

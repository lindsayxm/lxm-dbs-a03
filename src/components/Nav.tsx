"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useGame } from "@/lib/store";
import { TokenBadge } from "./TokenBadge";

const links = [
  { href: "/", label: "Observe" },
  { href: "/predictions", label: "My predictions" },
  { href: "/leaderboard", label: "Leaderboard" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/" || pathname.startsWith("/events");
  return pathname.startsWith(href);
}

function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex gap-4 text-sm">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`border-b-2 pb-1 ${active ? "border-observed text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Reads the URL, so it lives in its own Suspense boundary (required for dynamic routes). */
function CurrentNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

export function Nav() {
  const game = useGame();

  return (
    <header className="border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="font-mono text-sm font-bold tracking-tight">
          <span className="text-observed">|ψ⟩</span> The Observer Effect
        </Link>
        <nav aria-label="Main" className="order-last w-full sm:order-none sm:w-auto">
          <Suspense fallback={<NavLinks pathname={null} />}>
            <CurrentNavLinks />
          </Suspense>
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          {game && <TokenBadge amount={game.tokens} />}
          {!game ? null : game.username ? (
            <span className="font-mono text-muted">@{game.username}</span>
          ) : (
            <Link href="/claim" className="text-observed underline-offset-4 hover:underline">
              Claim name
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

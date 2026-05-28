"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, ChevronRight, Menu, Shield, X } from "lucide-react";

const terracotta = "#A54141";
const warmClay = "#C4876B";
const sandBeige = "#D9C49D";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isFloatingNav = pathname === "/home" || pathname === "/about" || pathname === "/dashboard";
  const navTagline =
    pathname === "/about"
      ? "Kecerdasan Kepercayaan Digital"
      : "Kepercayaan Digital. Dampak Nyata.";
  const navCtaLabel = pathname === "/about" ? "Mulai Analisis" : "Analisis Sekarang";

  const navItems = [
    { name: "Beranda", href: "/home" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tentang", href: "/about" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  if (isFloatingNav) {
    return (
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4 md:top-5 md:px-6">
        <nav
          className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md md:px-6 md:py-3.5"
          style={{ borderColor: `${sandBeige}aa` }}
        >
          <Link
            href="/home"
            className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-85 md:gap-3"
          >
            <div className="relative h-10 w-10 shrink-0 md:h-11 md:w-11">
              <Image
                src="/logo.png"
                alt="Logo INDOBUZZTRA"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block truncate text-base font-bold text-neutral-900 md:text-lg">
                INDOBUZZTRA
              </span>
              <span className="hidden text-[11px] text-neutral-500 sm:block md:text-xs">
                {navTagline}
              </span>
            </div>
          </Link>

          <div className="ml-auto hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-semibold transition-colors ${
                  pathname === item.href
                    ? ""
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                style={pathname === item.href ? { color: terracotta } : undefined}
              >
                {item.name}
                {pathname === item.href && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 mx-auto h-0.5 w-4/5 rounded-full"
                    style={{ backgroundColor: terracotta }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/home#analisis"
              className="hidden items-center gap-1 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 md:inline-flex"
              style={{
                background: `linear-gradient(90deg, ${terracotta}, ${warmClay})`,
              }}
            >
              {navCtaLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={toggleMenu}
              className="flex items-center justify-center rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
              aria-label="Buka/tutup menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {isOpen && (
          <div
            className="pointer-events-auto mx-auto mt-2 max-w-6xl rounded-2xl border bg-white/98 p-4 shadow-lg backdrop-blur-md md:hidden"
            style={{ borderColor: `${sandBeige}aa` }}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    pathname === item.href
                      ? "bg-neutral-50"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                  style={pathname === item.href ? { color: terracotta } : undefined}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/home#analisis"
                onClick={closeMenu}
                className="mt-2 flex items-center justify-center gap-1 rounded-full py-3 text-sm font-semibold text-white"
                style={{
                  background: `linear-gradient(90deg, ${terracotta}, ${warmClay})`,
                }}
              >
                {navCtaLabel}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="border-b bg-white" style={{ borderColor: `${sandBeige}88` }}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/home"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
            style={{
              background: `linear-gradient(145deg, ${terracotta}, ${warmClay})`,
            }}
          >
            <Shield className="h-5 w-5 text-white" strokeWidth={1.75} />
            <Activity
              className="absolute bottom-1.5 h-3.5 w-3.5 text-white/95"
              strokeWidth={2.5}
            />
          </div>
          <div className="leading-tight">
            <span className="block text-base font-bold text-neutral-900">INDOBUZZTRA</span>
            <span className="text-[11px] text-neutral-500">Kepercayaan Digital. Dampak Nyata.</span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-sm font-semibold transition-colors ${
                pathname === item.href ? "" : "text-neutral-600 hover:text-neutral-900"
              }`}
              style={pathname === item.href ? { color: terracotta } : undefined}
            >
              {item.name}
              {pathname === item.href && (
                <span
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: terracotta }}
                />
              )}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="flex items-center justify-center p-2 text-neutral-600 transition-colors hover:text-neutral-900 md:hidden"
          aria-label="Buka/tutup menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t bg-white md:hidden" style={{ borderColor: `${sandBeige}88` }}>
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  pathname === item.href ? "bg-neutral-50" : "text-neutral-600 hover:bg-neutral-50"
                }`}
                style={pathname === item.href ? { color: terracotta } : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
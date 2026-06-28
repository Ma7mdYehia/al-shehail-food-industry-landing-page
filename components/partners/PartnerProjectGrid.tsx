"use client";

import Image from "next/image";
import { useState } from "react";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import { manufacturingPartners } from "@/lib/content";
import {
  getPartnerProjectByPartnerName,
  getProjectStrengthChips,
  type PartnerProject,
} from "@/lib/partnerProjects";
import PartnerProjectModal from "./PartnerProjectModal";

// Derive a clean monogram from a partner name (e.g. "HÄLSA Bake" -> "HB").
function monogram(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

type Variant = "compact" | "detailed";

/**
 * Interactive partner grid shared by the homepage and the partners page. Each
 * card opens a centered project modal sourced from lib/partnerProjects.
 *   • variant="compact"  — homepage: clean logo + name only, no CTA text.
 *   • variant="detailed" — /partners: larger case-study-style cards with
 *     category, positioning, products count, and strength chips.
 */
export default function PartnerProjectGrid({
  className = "",
  variant = "compact",
}: {
  className?: string;
  variant?: Variant;
}) {
  const [activeProject, setActiveProject] = useState<PartnerProject | null>(
    null
  );

  const gridClass =
    variant === "detailed"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      : "grid grid-cols-1 gap-4 sm:grid-cols-3";

  return (
    <>
      <div className={`${gridClass} ${className}`}>
        {manufacturingPartners.map(({ name, assetKey }) => {
          const logoPath = assets.partners[assetKey];
          const project = getPartnerProjectByPartnerName(name);
          const open = () => project && setActiveProject(project);
          const commonProps = {
            type: "button" as const,
            onClick: open,
            "aria-haspopup": "dialog" as const,
            "aria-label": `View ${name} project details`,
          };

          // ---- Compact (homepage): logo + name only ----
          if (variant === "compact") {
            return (
              <button
                key={name}
                {...commonProps}
                className="group flex items-center gap-3.5 rounded-2xl border border-sand bg-cream px-5 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:bg-warmwhite hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-warmwhite"
              >
                {hasAsset(logoPath) ? (
                  <Image
                    src={logoPath}
                    alt={getAssetAlt(assetKey, name)}
                    width={128}
                    height={64}
                    className="h-12 w-28 flex-none object-contain"
                  />
                ) : (
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-sm font-bold text-gold transition-colors group-hover:border-champagne">
                    {monogram(name)}
                  </span>
                )}
                <span className="font-serif text-base font-semibold leading-tight text-charcoal transition-colors group-hover:text-ink sm:text-lg">
                  {name}
                </span>
              </button>
            );
          }

          // ---- Detailed (/partners): rich case-study card ----
          const chips = project ? getProjectStrengthChips(project) : [];
          return (
            <button
              key={name}
              {...commonProps}
              className="group flex h-full flex-col rounded-3xl border border-sand bg-cream p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:bg-warmwhite hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-warmwhite sm:p-7"
            >
              <div className="flex items-center gap-4">
                {hasAsset(logoPath) ? (
                  <span className="flex h-16 flex-none items-center justify-center rounded-2xl border border-sand bg-warmwhite px-3 shadow-card">
                    <Image
                      src={logoPath}
                      alt={getAssetAlt(assetKey, name)}
                      width={120}
                      height={56}
                      className="h-10 w-auto max-w-[6rem] object-contain"
                    />
                  </span>
                ) : (
                  <span className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl border border-sand bg-warmwhite font-serif text-lg font-bold text-gold shadow-card">
                    {monogram(name)}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-semibold leading-tight text-ink sm:text-xl">
                    {name}
                  </h3>
                  {project && (
                    <span className="mt-1.5 inline-flex items-center rounded-full border border-champagne/60 bg-warmwhite px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold">
                      {project.category}
                    </span>
                  )}
                </div>
              </div>

              {project && (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-stone">
                    {project.positioning}
                  </p>

                  {chips.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-sand bg-warmwhite px-2.5 py-1 text-[11px] font-medium text-charcoal transition-colors group-hover:border-champagne/50"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <span className="text-xs font-semibold text-charcoal">
                      {project.products.length}{" "}
                      {project.products.length === 1 ? "product" : "products"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                      Explore project
                      <svg
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      <PartnerProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}

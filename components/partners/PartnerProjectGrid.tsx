"use client";

import Image from "next/image";
import { useState } from "react";
import AssetHint from "@/components/AssetHint";
import { assets, hasAsset, getAssetAlt } from "@/lib/assets";
import { manufacturingPartners } from "@/lib/content";
import {
  getPartnerProjectByPartnerName,
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

/**
 * Interactive partner grid shared by the homepage and the partners page. Each
 * card opens a centered project modal sourced from lib/partnerProjects. Kept as
 * a client component so its surrounding pages can stay server components.
 */
export default function PartnerProjectGrid({
  className = "",
}: {
  className?: string;
}) {
  const [activeProject, setActiveProject] = useState<PartnerProject | null>(
    null
  );

  return (
    <>
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-3 ${className}`}>
        {manufacturingPartners.map(({ name, assetKey }) => {
          const logoPath = assets.partners[assetKey];
          const project = getPartnerProjectByPartnerName(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => project && setActiveProject(project)}
              aria-haspopup="dialog"
              aria-label={`View ${name} project details`}
              className="group flex flex-col rounded-2xl border border-sand bg-cream px-5 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:bg-warmwhite hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-warmwhite"
            >
              <div className="flex items-center gap-3.5">
                {hasAsset(logoPath) ? (
                  <Image
                    src={logoPath}
                    alt={getAssetAlt(assetKey, name)}
                    width={128}
                    height={64}
                    className="h-12 w-28 flex-none object-contain"
                  />
                ) : (
                  /* Placeholder: monogram until the official logo is supplied */
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-sand bg-warmwhite font-serif text-sm font-bold text-gold transition-colors group-hover:border-champagne">
                    {monogram(name)}
                  </span>
                )}
                <span className="font-serif text-base font-semibold leading-tight text-charcoal transition-colors group-hover:text-ink sm:text-lg">
                  {name}
                </span>
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                View project
                <svg
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  width="15"
                  height="15"
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

              {!hasAsset(logoPath) && (
                <AssetHint label="Upload official partner logo" className="mt-3" />
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

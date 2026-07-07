// Convenience barrel for the product data modules. Prefer importing directly
// from ./catalog or ./details in new code so the lightweight/heavy split stays
// real — see the module-level comments on each file for the intended split:
// catalog (+types) for listings/cards/home, details for the /products/[slug]
// solution pages only.

export * from "./types";
export * from "./catalog";
export * from "./details";

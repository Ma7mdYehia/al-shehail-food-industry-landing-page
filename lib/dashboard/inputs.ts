// Pure, directly-testable FormData parsing + payload building for every P05
// mutation (no server imports, no DB). Each builder:
//   1. rejects unknown submitted fields (allowlist),
//   2. validates + normalizes input (localized {en,ar}, enums, bounded sizes),
//   3. returns either { ok:false, errors } or { ok:true, value } where `value`
//      carries the EXACT database payload — including the security defaults
//      (new content is INACTIVE; new media is PENDING), so those defaults are
//      proven by executing this code rather than trusting a DB default.
//
// The server actions are thin wrappers that call these and run the query. Tests
// call them directly with real FormData.

import {
  localized,
  reqText,
  optText,
  slug as vSlug,
  oneOf,
  boolean as vBool,
  boundedInt,
  isUuid,
  rejectUnknownFormData,
  toLocalizedJson,
  type FieldErrors,
  type Validated,
  type Localized,
} from "@/lib/dashboard/validation";
import { PRODUCT_ICON_TYPES, PRODUCT_OPTION_TYPES, type ProductIconType, type ProductOptionType } from "@/lib/dashboard/product-constants";
import { MEDIA_TYPES, type MediaType } from "@/lib/dashboard/media-constants";
import { SERVICE_SECTION_TYPES, type ServiceSectionType } from "@/lib/dashboard/service-constants";
import { PPP_STATUSES, type PppStatus } from "@/lib/dashboard/partner-constants";
import { isEnquiryStatus } from "@/lib/dashboard/enquiry-constants";

type Row = Record<string, unknown>;
export type UpdateInput = { id: string; expectedUpdatedAt: string; set: Row };

function loc(fd: FormData, prefix: string, field: string, errors: FieldErrors, max: number): Localized {
  return localized({ en: fd.get(`${prefix}_en`), ar: fd.get(`${prefix}_ar`) }, field, errors, { max });
}
function optLoc(fd: FormData, prefix: string, field: string, errors: FieldErrors, max: number): Localized | null {
  const en = String(fd.get(`${prefix}_en`) ?? "").trim();
  if (!en) return null;
  return localized({ en: fd.get(`${prefix}_en`), ar: fd.get(`${prefix}_ar`) }, field, errors, { max });
}
function optId(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? "").trim();
  return v || null;
}
function optIntOrNull(fd: FormData, key: string): number | null {
  const raw = fd.get(key);
  if (raw === null || String(raw).trim() === "") return null;
  return boundedInt(raw, 1, 100000, 1);
}
function idField(fd: FormData, key: string, errors: FieldErrors): { id: string; expectedUpdatedAt: string } {
  const id = String(fd.get(key) ?? "");
  const expectedUpdatedAt = String(fd.get("expectedUpdatedAt") ?? "");
  if (!id) errors._form = "Unknown record.";
  if (!expectedUpdatedAt) errors._form = "Unknown record.";
  return { id, expectedUpdatedAt };
}
function done<T>(errors: FieldErrors, value: T): Validated<T> {
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

// ---- products ---------------------------------------------------------------

const PRODUCT_CREATE_ALLOW = ["slug", "categoryId", "name_en", "name_ar", "shortDescription_en", "shortDescription_ar", "cardDescription_en", "cardDescription_ar", "iconType", "imageAssetId", "featured"] as const;

export function buildProductCreate(fd: FormData): Validated<Row> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PRODUCT_CREATE_ALLOW, errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const categoryId = String(fd.get("categoryId") ?? "").trim();
  if (!categoryId) errors.categoryId = "Choose a category.";
  const name = loc(fd, "name", "name", errors, 200);
  const shortD = loc(fd, "shortDescription", "shortDescription", errors, 600);
  const cardD = loc(fd, "cardDescription", "cardDescription", errors, 600);
  const iconType = oneOf<ProductIconType>(fd.get("iconType"), PRODUCT_ICON_TYPES, "iconType", errors);
  return done(errors, {
    slug,
    category_id: categoryId,
    name_localized: toLocalizedJson(name),
    short_description_localized: toLocalizedJson(shortD),
    card_description_localized: toLocalizedJson(cardD),
    icon_type: iconType,
    image_asset_id: optId(fd, "imageAssetId"),
    featured: vBool(fd.get("featured")),
    is_active: false, // new content starts INACTIVE — activation is a later edit
  });
}

const PRODUCT_UPDATE_ALLOW = ["id", "expectedUpdatedAt", "slug", "categoryId", "name_en", "name_ar", "shortDescription_en", "shortDescription_ar", "cardDescription_en", "cardDescription_ar", "iconType", "imageAssetId", "featured", "sortOrder"] as const;

export function buildProductUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PRODUCT_UPDATE_ALLOW, errors);
  const { id, expectedUpdatedAt } = idField(fd, "id", errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const categoryId = String(fd.get("categoryId") ?? "").trim();
  if (!categoryId) errors.categoryId = "Choose a category.";
  const name = loc(fd, "name", "name", errors, 200);
  const shortD = loc(fd, "shortDescription", "shortDescription", errors, 600);
  const cardD = loc(fd, "cardDescription", "cardDescription", errors, 600);
  const iconType = oneOf<ProductIconType>(fd.get("iconType"), PRODUCT_ICON_TYPES, "iconType", errors);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      slug,
      category_id: categoryId,
      name_localized: toLocalizedJson(name),
      short_description_localized: toLocalizedJson(shortD),
      card_description_localized: toLocalizedJson(cardD),
      icon_type: iconType,
      image_asset_id: optId(fd, "imageAssetId"),
      featured: vBool(fd.get("featured")),
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

const PRODUCT_DETAIL_ALLOW = ["productId", "expectedUpdatedAt", "positioning_en", "positioning_ar", "disclaimer_en", "disclaimer_ar"] as const;

export type DetailInput = {
  productId: string;
  expectedUpdatedAt: string; // "" when no detail row exists yet (insert)
  set: Row;
};

export function buildProductDetail(fd: FormData): Validated<DetailInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PRODUCT_DETAIL_ALLOW, errors);
  const productId = String(fd.get("productId") ?? "");
  if (!productId) errors._form = "Unknown product.";
  const positioning = loc(fd, "positioning", "positioning", errors, 4000);
  const disclaimerEn = optText(fd.get("disclaimer_en"), "disclaimer.en", errors, 4000);
  const disclaimerAr = optText(fd.get("disclaimer_ar"), "disclaimer.ar", errors, 4000);
  const disclaimer = disclaimerEn ? { en: disclaimerEn, ar: disclaimerAr } : null;
  return done(errors, {
    productId,
    expectedUpdatedAt: String(fd.get("expectedUpdatedAt") ?? ""),
    set: { positioning_localized: toLocalizedJson(positioning), disclaimer_localized: disclaimer },
  });
}

// ---- product options --------------------------------------------------------

const OPTION_CREATE_ALLOW = ["productId", "type", "label_en", "label_ar", "sortOrder"] as const;

export function buildOptionCreate(fd: FormData): Validated<{ productId: string; insert: Row }> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, OPTION_CREATE_ALLOW, errors);
  const productId = String(fd.get("productId") ?? "");
  if (!productId) errors._form = "Unknown product.";
  const type = oneOf<ProductOptionType>(fd.get("type"), PRODUCT_OPTION_TYPES, "type", errors);
  const label = loc(fd, "label", "label", errors, 200);
  return done(errors, {
    productId,
    insert: {
      product_id: productId,
      type,
      label_localized: toLocalizedJson(label),
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

const OPTION_UPDATE_ALLOW = ["optionId", "expectedUpdatedAt", "type", "label_en", "label_ar", "sortOrder"] as const;

export function buildOptionUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, OPTION_UPDATE_ALLOW, errors);
  const id = String(fd.get("optionId") ?? "");
  const expectedUpdatedAt = String(fd.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) errors._form = "Unknown option.";
  const type = oneOf<ProductOptionType>(fd.get("type"), PRODUCT_OPTION_TYPES, "type", errors);
  const label = loc(fd, "label", "label", errors, 200);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      type,
      label_localized: toLocalizedJson(label),
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

// ---- categories -------------------------------------------------------------

const CATEGORY_CREATE_ALLOW = ["slug", "name_en", "name_ar", "description_en", "description_ar", "sortOrder"] as const;

export function buildCategoryCreate(fd: FormData): Validated<Row> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, CATEGORY_CREATE_ALLOW, errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const name = loc(fd, "name", "name", errors, 200);
  const description = loc(fd, "description", "description", errors, 600);
  return done(errors, {
    slug,
    name_localized: toLocalizedJson(name),
    description_localized: toLocalizedJson(description),
    sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    is_active: false,
  });
}

const CATEGORY_UPDATE_ALLOW = ["id", "expectedUpdatedAt", "slug", "name_en", "name_ar", "description_en", "description_ar", "isActive", "sortOrder"] as const;

export function buildCategoryUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, CATEGORY_UPDATE_ALLOW, errors);
  const { id, expectedUpdatedAt } = idField(fd, "id", errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const name = loc(fd, "name", "name", errors, 200);
  const description = loc(fd, "description", "description", errors, 600);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      slug,
      name_localized: toLocalizedJson(name),
      description_localized: toLocalizedJson(description),
      is_active: vBool(fd.get("isActive")),
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

// ---- media ------------------------------------------------------------------

const MEDIA_CREATE_ALLOW = ["key", "path", "type", "alt_en", "alt_ar", "width", "height"] as const;

export function buildMediaCreate(fd: FormData): Validated<Row> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, MEDIA_CREATE_ALLOW, errors);
  const key = reqText(fd.get("key"), "key", errors, 200);
  const path = optText(fd.get("path"), "path", errors, 600);
  const type = oneOf<MediaType>(fd.get("type"), MEDIA_TYPES, "type", errors);
  const alt = localized({ en: fd.get("alt_en"), ar: fd.get("alt_ar") }, "alt", errors, { max: 600 });
  return done(errors, {
    key,
    path: path || null,
    type,
    status: "pending", // new metadata is always PENDING — a forged status is ignored
    alt_localized: toLocalizedJson(alt),
    width: optIntOrNull(fd, "width"),
    height: optIntOrNull(fd, "height"),
  });
}

const MEDIA_UPDATE_ALLOW = ["id", "expectedUpdatedAt", "key", "path", "type", "status", "alt_en", "alt_ar", "width", "height"] as const;

export function buildMediaUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, MEDIA_UPDATE_ALLOW, errors);
  const { id, expectedUpdatedAt } = idField(fd, "id", errors);
  const key = reqText(fd.get("key"), "key", errors, 200);
  const path = optText(fd.get("path"), "path", errors, 600);
  const type = oneOf<MediaType>(fd.get("type"), MEDIA_TYPES, "type", errors);
  const status = oneOf(fd.get("status"), ["active", "pending", "legacy"] as const, "status", errors);
  const alt = localized({ en: fd.get("alt_en"), ar: fd.get("alt_ar") }, "alt", errors, { max: 600 });
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      key,
      path: path || null,
      type,
      status,
      alt_localized: toLocalizedJson(alt),
      width: optIntOrNull(fd, "width"),
      height: optIntOrNull(fd, "height"),
    },
  });
}

// ---- services ---------------------------------------------------------------

const SERVICE_CREATE_ALLOW = ["slug", "metaTitle_en", "metaTitle_ar", "metaDescription_en", "metaDescription_ar", "heroEyebrow_en", "heroEyebrow_ar", "heroTitle_en", "heroTitle_ar", "heroSubtitle_en", "heroSubtitle_ar"] as const;

export function buildServiceCreate(fd: FormData): Validated<Row> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, SERVICE_CREATE_ALLOW, errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const metaTitle = loc(fd, "metaTitle", "metaTitle", errors, 200);
  const metaDescription = loc(fd, "metaDescription", "metaDescription", errors, 600);
  const heroEyebrow = loc(fd, "heroEyebrow", "heroEyebrow", errors, 200);
  const heroTitle = loc(fd, "heroTitle", "heroTitle", errors, 200);
  const heroSubtitle = loc(fd, "heroSubtitle", "heroSubtitle", errors, 600);
  return done(errors, {
    slug,
    meta_title_localized: toLocalizedJson(metaTitle),
    meta_description_localized: toLocalizedJson(metaDescription),
    hero_eyebrow_localized: toLocalizedJson(heroEyebrow),
    hero_title_localized: toLocalizedJson(heroTitle),
    hero_subtitle_localized: toLocalizedJson(heroSubtitle),
    cta_json: {},
    is_active: false,
  });
}

const SERVICE_UPDATE_ALLOW = ["id", "expectedUpdatedAt", "slug", "metaTitle_en", "metaTitle_ar", "metaDescription_en", "metaDescription_ar", "heroEyebrow_en", "heroEyebrow_ar", "heroTitle_en", "heroTitle_ar", "heroSubtitle_en", "heroSubtitle_ar", "isActive", "sortOrder"] as const;

export function buildServiceUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, SERVICE_UPDATE_ALLOW, errors);
  const { id, expectedUpdatedAt } = idField(fd, "id", errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const metaTitle = loc(fd, "metaTitle", "metaTitle", errors, 200);
  const metaDescription = loc(fd, "metaDescription", "metaDescription", errors, 600);
  const heroEyebrow = loc(fd, "heroEyebrow", "heroEyebrow", errors, 200);
  const heroTitle = loc(fd, "heroTitle", "heroTitle", errors, 200);
  const heroSubtitle = loc(fd, "heroSubtitle", "heroSubtitle", errors, 600);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      slug,
      meta_title_localized: toLocalizedJson(metaTitle),
      meta_description_localized: toLocalizedJson(metaDescription),
      hero_eyebrow_localized: toLocalizedJson(heroEyebrow),
      hero_title_localized: toLocalizedJson(heroTitle),
      hero_subtitle_localized: toLocalizedJson(heroSubtitle),
      is_active: vBool(fd.get("isActive")),
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

// ---- service sections -------------------------------------------------------

const SECTION_CREATE_ALLOW = ["serviceId", "sectionType", "title_en", "title_ar", "eyebrow_en", "eyebrow_ar", "description_en", "description_ar", "sortOrder"] as const;

export function buildSectionCreate(fd: FormData): Validated<{ serviceId: string; insert: Row }> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, SECTION_CREATE_ALLOW, errors);
  const serviceId = String(fd.get("serviceId") ?? "");
  if (!serviceId) errors._form = "Unknown service.";
  const sectionType = oneOf<ServiceSectionType>(fd.get("sectionType"), SERVICE_SECTION_TYPES, "sectionType", errors);
  const title = optLoc(fd, "title", "title", errors, 200);
  const eyebrow = optLoc(fd, "eyebrow", "eyebrow", errors, 200);
  const description = optLoc(fd, "description", "description", errors, 4000);
  return done(errors, {
    serviceId,
    insert: {
      service_id: serviceId,
      section_type: sectionType,
      title_localized: title ? toLocalizedJson(title) : null,
      eyebrow_localized: eyebrow ? toLocalizedJson(eyebrow) : null,
      description_localized: description ? toLocalizedJson(description) : null,
      items_json: [],
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
      is_active: false,
    },
  });
}

const SECTION_UPDATE_ALLOW = ["sectionId", "expectedUpdatedAt", "sectionType", "title_en", "title_ar", "eyebrow_en", "eyebrow_ar", "description_en", "description_ar", "isActive", "sortOrder"] as const;

export function buildSectionUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, SECTION_UPDATE_ALLOW, errors);
  const id = String(fd.get("sectionId") ?? "");
  const expectedUpdatedAt = String(fd.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) errors._form = "Unknown section.";
  const sectionType = oneOf<ServiceSectionType>(fd.get("sectionType"), SERVICE_SECTION_TYPES, "sectionType", errors);
  const title = optLoc(fd, "title", "title", errors, 200);
  const eyebrow = optLoc(fd, "eyebrow", "eyebrow", errors, 200);
  const description = optLoc(fd, "description", "description", errors, 4000);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      section_type: sectionType,
      title_localized: title ? toLocalizedJson(title) : null,
      eyebrow_localized: eyebrow ? toLocalizedJson(eyebrow) : null,
      description_localized: description ? toLocalizedJson(description) : null,
      is_active: vBool(fd.get("isActive")),
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

// ---- partners ---------------------------------------------------------------

const PARTNER_CREATE_ALLOW = ["slug", "name", "assetId"] as const;

export function buildPartnerCreate(fd: FormData): Validated<Row> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PARTNER_CREATE_ALLOW, errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const name = reqText(fd.get("name"), "name", errors, 200);
  return done(errors, { slug, name, asset_id: optId(fd, "assetId"), is_active: false });
}

const PARTNER_UPDATE_ALLOW = ["id", "expectedUpdatedAt", "slug", "name", "assetId", "isActive", "sortOrder"] as const;

export function buildPartnerUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PARTNER_UPDATE_ALLOW, errors);
  const { id, expectedUpdatedAt } = idField(fd, "id", errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const name = reqText(fd.get("name"), "name", errors, 200);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      slug,
      name,
      asset_id: optId(fd, "assetId"),
      is_active: vBool(fd.get("isActive")),
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

// ---- projects ---------------------------------------------------------------

const PROJECT_CREATE_ALLOW = ["partnerId", "slug", "title_en", "title_ar", "summary_en", "summary_ar"] as const;

export function buildProjectCreate(fd: FormData): Validated<{ partnerId: string; insert: Row }> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PROJECT_CREATE_ALLOW, errors);
  const partnerId = String(fd.get("partnerId") ?? "");
  if (!partnerId) errors._form = "Unknown partner.";
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const title = loc(fd, "title", "title", errors, 200);
  const summary = loc(fd, "summary", "summary", errors, 600);
  return done(errors, {
    partnerId,
    insert: {
      partner_id: partnerId,
      slug,
      title_localized: toLocalizedJson(title),
      summary_localized: toLocalizedJson(summary),
      project_detail_json: {},
      is_active: false,
    },
  });
}

const PROJECT_UPDATE_ALLOW = ["id", "expectedUpdatedAt", "slug", "title_en", "title_ar", "summary_en", "summary_ar", "isActive", "sortOrder"] as const;

export function buildProjectUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PROJECT_UPDATE_ALLOW, errors);
  const { id, expectedUpdatedAt } = idField(fd, "id", errors);
  const slug = vSlug(fd.get("slug"), "slug", errors);
  const title = loc(fd, "title", "title", errors, 200);
  const summary = loc(fd, "summary", "summary", errors, 600);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      slug,
      title_localized: toLocalizedJson(title),
      summary_localized: toLocalizedJson(summary),
      is_active: vBool(fd.get("isActive")),
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

// ---- project products -------------------------------------------------------

const PPP_CREATE_ALLOW = ["projectId", "productId", "name_en", "name_ar", "status", "sortOrder"] as const;

export function buildProjectProductCreate(fd: FormData): Validated<{ projectId: string; insert: Row }> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PPP_CREATE_ALLOW, errors);
  const projectId = String(fd.get("projectId") ?? "");
  if (!projectId) errors._form = "Unknown project.";
  const status = oneOf<PppStatus>(fd.get("status"), PPP_STATUSES, "status", errors);
  const name = optLoc(fd, "name", "name", errors, 200);
  return done(errors, {
    projectId,
    insert: {
      partner_project_id: projectId,
      product_id: optId(fd, "productId"), // null preserved when no catalog product
      product_name_localized: name ? toLocalizedJson(name) : null,
      status,
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

const PPP_UPDATE_ALLOW = ["mappingId", "expectedUpdatedAt", "productId", "name_en", "name_ar", "status", "sortOrder"] as const;

export function buildProjectProductUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, PPP_UPDATE_ALLOW, errors);
  const id = String(fd.get("mappingId") ?? "");
  const expectedUpdatedAt = String(fd.get("expectedUpdatedAt") ?? "");
  if (!id || !expectedUpdatedAt) errors._form = "Unknown mapping.";
  const status = oneOf<PppStatus>(fd.get("status"), PPP_STATUSES, "status", errors);
  const name = optLoc(fd, "name", "name", errors, 200);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: {
      product_id: optId(fd, "productId"),
      product_name_localized: name ? toLocalizedJson(name) : null,
      status,
      sort_order: boundedInt(fd.get("sortOrder"), 0, 100000, 0),
    },
  });
}

// ---- enquiries --------------------------------------------------------------

const ENQUIRY_UPDATE_ALLOW = ["id", "expectedUpdatedAt", "status", "internalNotes", "assignedTo"] as const;

export type EnquiryUpdateInput = {
  id: string;
  expectedUpdatedAt: string;
  status: string;
  assignedTo: string | null;
  set: Row;
};

export function buildEnquiryUpdate(fd: FormData): Validated<EnquiryUpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, ENQUIRY_UPDATE_ALLOW, errors);
  const id = String(fd.get("id") ?? "");
  const expectedUpdatedAt = String(fd.get("expectedUpdatedAt") ?? "");
  if (!id) errors._form = "Unknown enquiry.";
  if (!expectedUpdatedAt) errors._form = "Unknown enquiry.";
  const status = String(fd.get("status") ?? "");
  if (!isEnquiryStatus(status)) errors.status = "Choose a valid status.";
  const notesRaw = fd.get("internalNotes");
  const notes = typeof notesRaw === "string" ? notesRaw.trim() : "";
  if (notes.length > 4000) errors.internalNotes = "Notes must be 4000 characters or fewer.";
  const assignedRaw = String(fd.get("assignedTo") ?? "");
  const assignedTo = assignedRaw === "" ? null : assignedRaw;
  // Malformed (non-UUID) assignee ids are rejected here; the ACTIVE-membership
  // check is enforced in the action against the assignable-members RPC.
  if (assignedTo !== null && !isUuid(assignedTo)) errors.assignedTo = "Invalid assignee.";
  return done(errors, {
    id,
    expectedUpdatedAt,
    status,
    assignedTo,
    set: { status, internal_notes: notes.length ? notes : null, assigned_to: assignedTo },
  });
}

// ---- shared content ---------------------------------------------------------

const SHARED_UPDATE_ALLOW = ["id", "expectedUpdatedAt", "recipeDisclaimer_en", "recipeDisclaimer_ar"] as const;

export function buildSharedUpdate(fd: FormData): Validated<UpdateInput> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, SHARED_UPDATE_ALLOW, errors);
  const id = String(fd.get("id") ?? "default");
  const expectedUpdatedAt = String(fd.get("expectedUpdatedAt") ?? "");
  if (!expectedUpdatedAt) errors._form = "Unknown record.";
  const disclaimer = loc(fd, "recipeDisclaimer", "recipeDisclaimer", errors, 4000);
  return done(errors, {
    id,
    expectedUpdatedAt,
    set: { recipe_disclaimer_localized: toLocalizedJson(disclaimer) },
  });
}

// ---- deletes + team state (unknown-field rejection everywhere) --------------

/**
 * Parse a delete request that carries a single id under `idKey`. Rejects any
 * other submitted field (framework `$ACTION_*` bookkeeping is ignored by
 * rejectUnknownFormData). Returns the id or a generic error.
 */
export function buildDeleteInput(fd: FormData, idKey: string): Validated<{ id: string }> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, [idKey], errors);
  const id = String(fd.get(idKey) ?? "");
  if (!id) errors._form = "Unknown record.";
  return done(errors, { id });
}

const DASHBOARD_ROLE_VALUES = ["owner", "admin", "editor"] as const;
export type DashboardRoleValue = (typeof DASHBOARD_ROLE_VALUES)[number];

/** Parse an owner-only team member state change. Rejects unknown fields, a
 * non-UUID member id, and any role not in the database enum (the browser is
 * never trusted for the role). */
export function buildMemberState(fd: FormData): Validated<{
  memberId: string;
  role: DashboardRoleValue;
  isActive: boolean;
}> {
  const errors: FieldErrors = {};
  rejectUnknownFormData(fd, ["memberId", "role", "isActive"], errors);
  const memberId = String(fd.get("memberId") ?? "");
  if (!isUuid(memberId)) errors._form = "Unknown member.";
  const roleRaw = String(fd.get("role") ?? "");
  if (!(DASHBOARD_ROLE_VALUES as readonly string[]).includes(roleRaw)) errors.role = "Invalid role.";
  const isActive = String(fd.get("isActive") ?? "") === "true";
  return done(errors, { memberId, role: roleRaw as DashboardRoleValue, isActive });
}

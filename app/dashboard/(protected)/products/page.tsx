import type { Metadata } from "next";
import Link from "next/link";
import { requireDashboardMember } from "@/lib/auth/dashboard";
import { canDeleteContent } from "@/lib/auth/roles";
import {
  listProducts,
  listCategories,
  listMediaOptions,
  getProduct,
} from "@/lib/dashboard/product-data";
import { ProductEditor } from "@/components/dashboard/ProductEditor";
import { CategoryManager } from "@/components/dashboard/CategoryManager";
import { ProductActiveToggle } from "@/components/dashboard/ProductActiveToggle";
import { formatDate } from "@/lib/dashboard/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const member = await requireDashboardMember();
  const canDelete = canDeleteContent(member.role);

  const editId = str(searchParams.id);
  const isNew = str(searchParams.new) === "1";
  const filters = {
    search: str(searchParams.search),
    categoryId: str(searchParams.categoryId),
    active: str(searchParams.active),
    page: str(searchParams.page) || "1",
  };

  const [list, categories, media, editProduct] = await Promise.all([
    listProducts(filters),
    listCategories(),
    listMediaOptions(),
    editId ? getProduct(editId) : Promise.resolve(null),
  ]);

  // Editor view (create or edit).
  if (isNew || editId) {
    return (
      <>
        <h1 className="dash-page-title">{isNew ? "New product" : "Edit product"}</h1>
        <p className="dash-page-sub">
          <Link className="dash-inline-link" href="/dashboard/products">← Back to products</Link>
        </p>
        {editId && !editProduct ? (
          <div className="dash-glass dash-card" role="status">
            <p className="dash-card-note">That product could not be found.</p>
          </div>
        ) : (
          <ProductEditor
            mode={isNew ? "create" : "edit"}
            product={editProduct}
            categories={categories}
            media={media}
            canDelete={canDelete}
          />
        )}
      </>
    );
  }

  return (
    <>
      <h1 className="dash-page-title">Products</h1>
      <p className="dash-page-sub">Create and manage the product catalog.</p>

      <div className="dash-toolbar">
        <Link className="dash-btn dash-btn-primary" href="/dashboard/products?new=1">
          + New product
        </Link>
      </div>

      <CategoryManager categories={categories} />

      <form method="get" className="dash-filters" aria-label="Filter products">
        <label className="dash-field">
          <span className="dash-field-label">Search (slug)</span>
          <input className="dash-input" type="search" name="search" defaultValue={filters.search} placeholder="arabic-bread" />
        </label>
        <label className="dash-field">
          <span className="dash-field-label">Category</span>
          <select className="dash-select" name="categoryId" defaultValue={filters.categoryId}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          <span className="dash-field-label">State</span>
          <select className="dash-select" name="active" defaultValue={filters.active}>
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
        <div className="dash-field dash-filters-actions">
          <button type="submit" className="dash-btn dash-btn-primary">Apply</button>
          <Link href="/dashboard/products" className="dash-btn">Reset</Link>
        </div>
      </form>

      {list.status === "unavailable" ? (
        <div className="dash-glass dash-card" role="status">
          <p className="dash-card-note dash-card-error">Products are unavailable right now. Please refresh.</p>
        </div>
      ) : list.rows.length === 0 ? (
        <div className="dash-glass dash-card" role="status">
          <p className="dash-card-label">No products</p>
          <p className="dash-card-note">No products match the current filters.</p>
        </div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">State</th>
                <th scope="col">Updated</th>
                <th scope="col"><span className="dash-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {list.rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.name}
                    {p.featured ? <span className="dash-status" style={{ marginLeft: 8 }}>featured</span> : null}
                    <span className="dash-card-note"> /{p.slug}</span>
                  </td>
                  <td>{p.categoryName}</td>
                  <td>
                    <span className={p.isActive ? "dash-status" : "dash-status dash-status-closed"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{formatDate(p.updatedAt)}</td>
                  <td className="dash-row-actions">
                    <Link className="dash-inline-link" href={`/dashboard/products?id=${encodeURIComponent(p.id)}`}>Edit</Link>
                    <ProductActiveToggle id={p.id} isActive={p.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// Presentational "Coming next" placeholder for dashboard modules not yet
// implemented in P04. Server component (no client JS). Authorization is enforced
// by the protected layout (and, for Team, an owner-only server guard).
export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <>
      <h1 className="dash-page-title">{title}</h1>
      <p className="dash-page-sub">
        {description ?? "This module is part of the dashboard and will be delivered in a focused later patch."}
      </p>
      <div className="dash-glass dash-card" style={{ maxWidth: 560 }}>
        <p className="dash-card-label">Status</p>
        <p style={{ margin: 0, fontWeight: 600 }}>
          <span className="dash-soon">Coming next</span>
        </p>
        <p className="dash-card-note">
          The authorization and navigation structure is in place; content management arrives in
          an upcoming patch.
        </p>
      </div>
    </>
  );
}

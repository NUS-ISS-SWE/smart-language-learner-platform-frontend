"use client";

import Link from "next/link";

// This boundary replaces the root layout; use self-contained styles and no providers.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f7f6f2",
          color: "#243746",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <section
            style={{
              maxWidth: "460px",
              padding: "32px",
              border: "1px solid #d7e0e3",
              borderRadius: "16px",
              background: "white",
            }}
          >
            <p
              style={{
                color: "#0f766e",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              SMART LANGUAGE LEARNER
            </p>
            <h1
              style={{
                fontFamily:
                  'Georgia, "Times New Roman", "Songti SC", "STSong", "SimSun", serif',
                fontWeight: 400,
                fontSize: "36px",
                lineHeight: 1.15,
              }}
            >
              Let’s try that again.
            </h1>
            <p style={{ color: "#536570", lineHeight: 1.7 }}>
              We couldn’t load the application. Try again, or return to the
              homepage.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                alignItems: "center",
                marginTop: "24px",
              }}
            >
              <button
                onClick={retry}
                style={{
                  minHeight: "44px",
                  padding: "12px 20px",
                  background: "#0f766e",
                  color: "white",
                  border: 0,
                  borderRadius: "8px",
                  font: "inherit",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                style={{ color: "#0f766e", padding: "12px 0" }}
              >
                Go to homepage
              </Link>
            </div>
            {process.env.NODE_ENV === "development" && (
              <details style={{ marginTop: "24px" }}>
                <summary>Developer details</summary>
                <pre
                  style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                >
                  {error.message}
                </pre>
              </details>
            )}
          </section>
        </main>
      </body>
    </html>
  );
}

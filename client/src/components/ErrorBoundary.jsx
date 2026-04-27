import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#0f172a", color: "#e2e8f0", fontFamily: "monospace",
          padding: "2rem", textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💥</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>
            App crashed — check console for details
          </h1>
          <pre style={{
            background: "#1e293b", padding: "1rem", borderRadius: 8,
            maxWidth: 700, width: "100%", overflowX: "auto",
            fontSize: 12, color: "#fca5a5", textAlign: "left",
          }}>
            {this.state.error?.message}
            {"\n\n"}
            {this.state.error?.stack?.split("\n").slice(0, 8).join("\n")}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20, padding: "10px 24px", borderRadius: 8,
              background: "#3AB6FF", color: "#fff", border: "none",
              cursor: "pointer", fontWeight: 700, fontSize: 14,
            }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

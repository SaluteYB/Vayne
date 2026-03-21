// DIAGNOSTIC: minimal render test — no child components
export default function App() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "radial-gradient(ellipse at 30% 30%, #1b3a6b 0%, #050a18 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "-apple-system, sans-serif",
      gap: 12,
    }}>
      <div style={{ fontSize: 48 }}>📱</div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>英语打卡</div>
      <div style={{ fontSize: 14, opacity: 0.5 }}>React is working</div>
    </div>
  );
}

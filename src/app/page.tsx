export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#000",
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 100,
          fontSize: "clamp(3rem, 10vw, 8rem)",
          letterSpacing: "0.25em",
          color: "#fff",
          userSelect: "none",
        }}
      >
        ottto
      </span>
    </main>
  );
}

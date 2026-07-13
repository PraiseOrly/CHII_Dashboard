/* Decorative header background — faint triangle pattern with the two brand
   design elements bleeding off the left & right edges and a solid-navy centre
   so the header title stays readable. Drop this as the first child of a
   position:relative, overflow:hidden header with backgroundColor #102C5E. */
export default function HeaderDesign() {
  return (
    <>
      {/* Design elements anchored to the left & right edges (natural aspect ratio) */}
      <img src="/images/design1.png" alt="" aria-hidden="true"
        style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
      <img src="/images/design2.png" alt="" aria-hidden="true"
        style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

      {/* Center-blue overlay — keeps the title area solid navy & readable */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />

      {/* Faint triangle pattern across the whole header */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
    </>
  );
}

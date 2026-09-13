const SELECTOR =
  ".table-card, .disposisi-card, .arsip-table-card, .master-card, .arsip-table-wrapper, .laporan-table-wrapper, .table-wrapper";

export function initHScroll() {
  let active = null;

  const nearest = (el) => {
    let n = el;
    while (n && n !== document.body) {
      if (n.matches && n.matches(SELECTOR)) return n;
      n = n.parentElement;
    }
    return null;
  };

  const onPointerDown = (e) => {
    const s = nearest(e.target);
    if (s) active = s;
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    const t = e.target;

    if (
      t &&
      (t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.tagName === "SELECT") &&
      !nearest(t)
    ) {
      return;
    }

    const scroller = nearest(t) || active;
    if (!scroller || !document.body.contains(scroller)) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (maxScroll <= 0) return;

    e.preventDefault();
    scroller.scrollBy({
      left: e.key === "ArrowLeft" ? -150 : 150,
      behavior: "smooth",
    });
  };

  document.addEventListener("mousedown", onPointerDown, true);
  document.addEventListener("keydown", onKeyDown);

  return () => {
    document.removeEventListener("mousedown", onPointerDown, true);
    document.removeEventListener("keydown", onKeyDown);
  };
}
// Monotone cubic interpolation: smooth tangents without inventing peaks between observations.
export function smoothPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M${points[0][0]},${points[0][1]}`;
  const slopes = points
    .slice(1)
    .map((p, i) => (p[1] - points[i][1]) / (p[0] - points[i][0]));
  const tangents = points.map((_, i) =>
    i === 0
      ? slopes[0]
      : i === points.length - 1
        ? slopes.at(-1)
        : slopes[i - 1] * slopes[i] <= 0
          ? 0
          : 2 / (1 / slopes[i - 1] + 1 / slopes[i]),
  );
  slopes.forEach((s, i) => {
    if (s === 0) {
      tangents[i] = tangents[i + 1] = 0;
      return;
    }
    const norm = Math.hypot(tangents[i] / s, tangents[i + 1] / s);
    if (norm > 3) {
      tangents[i] *= 3 / norm;
      tangents[i + 1] *= 3 / norm;
    }
  });
  return (
    `M${points[0][0]},${points[0][1]}` +
    points
      .slice(1)
      .map((p, i) => {
        const a = points[i],
          dx = (p[0] - a[0]) / 3;
        return `C${a[0] + dx},${a[1] + tangents[i] * dx} ${p[0] - dx},${p[1] - tangents[i + 1] * dx} ${p[0]},${p[1]}`;
      })
      .join("")
  );
}

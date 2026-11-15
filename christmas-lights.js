(() => {
  const canvas = document.querySelector('#endgame-holiday .perimeter-lights');
  const context = canvas.getContext('2d');
  if (!context) return;

  const joins = document.querySelectorAll('#endgame-holiday .wire-join');
  const colors = ['#ffd080', '#ff757a', '#81e2c6'];

  function drawBulb(x, y, angle, scale, index) {
    const color = colors[index % colors.length];
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.scale(scale, scale);
    context.fillStyle = '#25473c';
    context.fillRect(-2.5, -1, 5, 4.5);
    context.shadowBlur = 6 * scale;
    context.shadowColor = color;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(-2.3, 3);
    context.bezierCurveTo(-5.6, 5, -4.8, 10.5, -.5, 14);
    context.quadraticCurveTo(0, 14.5, .5, 14);
    context.bezierCurveTo(4.8, 10.5, 5.6, 5, 2.3, 3);
    context.closePath();
    context.fill();
    context.shadowBlur = 0;
    context.fillStyle = 'rgba(255, 255, 255, .72)';
    context.beginPath();
    context.ellipse(-1.6, 6.8, .8, 2, .18, 0, 2 * Math.PI);
    context.fill();
    context.restore();
  }

  // A quadratic sag keeps the lamps and the wire on exactly the same curve.
  function strand(x1, y1, x2, y2, bendX, bendY, swags) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return {
      length: Math.hypot(dx, dy),
      point(t) {
        const u = (t * swags) % 1;
        const sag = 4 * u * (1 - u);
        return [x1 + dx * t + bendX * sag, y1 + dy * t + bendY * sag];
      },
      trace(path) {
        path.moveTo(x1, y1);
        for (let i = 1; i <= swags; i++) {
          const mid = (i - .5) / swags;
          path.quadraticCurveTo(x1 + dx * mid + 2 * bendX, y1 + dy * mid + 2 * bendY,
            x1 + dx * i / swags, y1 + dy * i / swags);
        }
      }
    };
  }

  function paint() {
    const bounds = canvas.getBoundingClientRect();
    const { width, height, left, top } = bounds;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);

    const scale = Math.min(1, Math.max(.68, Math.min(width, height) / 560));
    const inset = 11 * scale;
    const right = width - inset;
    const bottom = height - inset;
    const spacing = 65 * scale;
    const across = Math.max(1, Math.round((right - inset) / (spacing * 3)));
    const down = Math.max(1, Math.round((bottom - inset) / (spacing * 3)));
    const pi = Math.PI;
    const topWire = strand(inset, inset, right, inset, 0, 8 * scale, across);
    const bottomWire = strand(inset, bottom, right, bottom, 0, -5 * scale, across);
    const leftWire = strand(inset, inset, inset, bottom, 4 * scale, 0, down);
    const rightWire = strand(right, inset, right, bottom, -4 * scale, 0, down);
    const wire = new Path2D();
    const bulbs = [];

    function addStrand(section, angle, gap, minimum = 0) {
      section.trace(wire);
      const intervals = Math.max(1, Math.round(section.length / gap));
      for (let i = 1; i < intervals && section.length > minimum; i++) {
        const [x, y] = section.point(i / intervals);
        bulbs.push([x, y, angle + .17 * Math.sin(i * 2.3), scale, bulbs.length]);
      }
    }

    addStrand(topWire, 0, spacing);
    addStrand(rightWire, .95, spacing);
    addStrand(bottomWire, pi, spacing);
    addStrand(leftWire, -.95, spacing);

    // These DOM anchors follow the rotation of the existing title lights.
    joins.forEach((join, index) => {
      const anchor = join.getBoundingClientRect();
      const x = anchor.left - left;
      const y = anchor.top - top;
      const distance = index === 0 ? x - inset : right - x;
      const splitY = Math.max(inset, y - Math.min(64 * scale, Math.max(0, distance) * .2));
      const t = Math.min(1, (splitY - inset) / (bottom - inset));
      const [sx, sy] = (index === 0 ? leftWire : rightWire).point(t);
      const dip = Math.min(17 * scale, Math.abs(x - sx) * .07);
      addStrand(strand(sx, sy, x, y, 0, dip, 1), index === 0 ? -.12 : .12, spacing * 1.18, 32);
    });

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 2.6 * scale;
    context.strokeStyle = '#132f2b';
    context.stroke(wire);
    context.lineWidth = 1.1 * scale;
    context.strokeStyle = '#41725e';
    context.stroke(wire);
    bulbs.push([inset, inset, -pi / 4, scale, 0], [right, inset, pi / 4, scale, 1],
      [right, bottom, 3 * pi / 4, scale, 2], [inset, bottom, -3 * pi / 4, scale, 0]);
    for (const bulb of bulbs) drawBulb(...bulb);
  }

  paint();
  const observer = new ResizeObserver(paint);
  observer.observe(canvas);
  observer.observe(document.querySelector('#endgame-holiday .masthead'));
  window.addEventListener('resize', paint);
})();

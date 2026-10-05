export function drawInteractionMessage(ctx, nearbyPoint) {
  if (!nearbyPoint) return;

  const [px, py] = nearbyPoint.position.split(",").map(Number);
  const text = `Hi ${nearbyPoint.name}`;

  ctx.save();
  ctx.font = "8px 'Press Start 2P', monospace";
  ctx.textBaseline = "top";

  const padding = 3;
  const boxW = Math.ceil(ctx.measureText(text).width) + padding * 2;
  const boxH = 8 + padding * 2;
  const boxX = Math.round(px + 8 - boxW / 2);
  const boxY = Math.round(py - boxH - 4);

  ctx.fillStyle = "rgba(78, 26, 182, 0.6)";
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1);
  ctx.fillStyle = "pink";
  ctx.fillText(text, boxX + padding, boxY + padding);
  ctx.restore();
}
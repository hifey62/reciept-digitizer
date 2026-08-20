// services/pushToSheet.js
const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwJnirR0ydxGLdLOISYHIl9vkO-VbBnTwQxiEsOCTOF2whQZJHchzsB9gwhjd0RgX9Q/exec";

export async function pushToSheet(data) {
  const response = await fetch(SHEET_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}
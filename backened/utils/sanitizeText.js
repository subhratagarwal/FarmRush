// sanitizeText.js
// Removes extended pictographic characters (emoji) that PDF can't encode, and trims extra whitespace.
function stripEmoji(text = '') {
  // Remove most emoji/ext pictographs (works in Node versions that support Unicode property escapes)
  try {
    return String(text).replace(/\p{Extended_Pictographic}/gu, '').trim();
  } catch (e) {
    // Fallback if Unicode property escapes not supported: basic emoji strip fallback
    return String(text).replace(/[\u{1F600}-\u{1F64F}]/gu, '') // emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // symbols & pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // transport & map
      .replace(/[\u{2600}-\u{26FF}]/gu, '')   // miscellaneous symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, '')   // dingbats
      .trim();
  }
}

module.exports = { stripEmoji };

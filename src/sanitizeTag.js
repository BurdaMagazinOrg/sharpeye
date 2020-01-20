const sanitizeTag = string => {
  return string
    .replace(/[^a-z0-9_\-]/gi, "_")
    .replace(/^_/, "")
    .toLowerCase()
}

module.exports = sanitizeTag

import { escapeRegExp } from "./stringUtils.js"
/**
 * Escape XML/HTML special characters for safe interpolation into element
 * text content (between tags). Use when untrusted strings (process stdout,
 * user input, external data) go inside `<tag>${here}</tag>`.
 */
export function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Escape for interpolation into a double- or single-quoted attribute value:
 * `<tag attr="${here}">`. Escapes quotes in addition to `& < >`.
 */
export function escapeXmlAttr(s: string): string {
  return escapeXml(s).replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

/**
 * Extracts the content of the first XML-style tag with the given name.
 * Handles nested tags of the same name by tracking tag depth.
 *
 * @param html The string containing XML-like tags
 * @param tagName The name of the tag to extract
 * @returns The content between the tags, or null if not found
 */
export function extractTag(html: string, tagName: string): string | null {
  if (!html.trim() || !tagName.trim()) {
    return null
  }

  const escapedTag = escapeRegExp(tagName)
  const openingTagRegex = new RegExp(`<${escapedTag}(?:\\s+[^>]*?)?>`, 'gi')
  const closingTagRegex = new RegExp(`<\\/${escapedTag}>`, 'gi')

  // Find the first opening tag
  const firstOpenMatch = openingTagRegex.exec(html)
  if (!firstOpenMatch) {
    return null
  }

  const startContentIndex = firstOpenMatch.index + firstOpenMatch[0].length
  let depth = 1
  let searchIndex = startContentIndex

  // Manually find the matching closing tag by tracking depth
  while (depth > 0) {
    openingTagRegex.lastIndex = searchIndex
    closingTagRegex.lastIndex = searchIndex

    const nextOpen = openingTagRegex.exec(html)
    const nextClose = closingTagRegex.exec(html)

    if (!nextClose) {
      // No matching closing tag found
      return null
    }

    if (nextOpen && nextOpen.index < nextClose.index) {
      // Found another opening tag before the next closing tag
      depth++
      searchIndex = nextOpen.index + nextOpen[0].length
    } else {
      // Found a closing tag
      depth--
      if (depth === 0) {
        return html.slice(startContentIndex, nextClose.index)
      }
      searchIndex = nextClose.index + nextClose[0].length
    }
  }

  return null
}

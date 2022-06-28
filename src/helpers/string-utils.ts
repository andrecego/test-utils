
export function replaceEnding(str: string, replaceFrom: string, replaceTo: string): string {
  if (!str.endsWith(replaceFrom)) { return str }

  return str.slice(0, -replaceFrom.length) + replaceTo
}
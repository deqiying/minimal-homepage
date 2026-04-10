type YamlScalar = string | number | boolean | null
type YamlValue = YamlScalar | YamlObject | YamlValue[]

interface YamlObject {
  [key: string]: YamlValue
}

const countIndent = (line: string, lineNumber: number) => {
  const match = line.match(/^ */)
  const indent = match?.[0].length ?? 0

  if (line.includes('\t')) {
    throw new Error(`Line ${lineNumber}: Tabs are not supported in config.yaml. Please use spaces.`)
  }

  return indent
}

const isIgnorableLine = (line: string) => {
  const trimmed = line.trim()
  return trimmed.length === 0 || trimmed.startsWith('#')
}

const stripInlineComment = (value: string) => {
  let inSingle = false
  let inDouble = false

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]

    if (char === "'" && !inDouble) {
      if (inSingle && value[index + 1] === "'") {
        index += 1
        continue
      }

      inSingle = !inSingle
      continue
    }

    if (char === '"' && !inSingle) {
      let slashCount = 0
      for (let cursor = index - 1; cursor >= 0 && value[cursor] === '\\'; cursor -= 1) {
        slashCount += 1
      }

      if (slashCount % 2 === 0) {
        inDouble = !inDouble
      }

      continue
    }

    if (!inSingle && !inDouble && char === '#' && (index === 0 || /\s/.test(value[index - 1]))) {
      return value.slice(0, index).trimEnd()
    }
  }

  return value.trimEnd()
}

const findMappingSeparator = (value: string) => {
  let inSingle = false
  let inDouble = false

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]

    if (char === "'" && !inDouble) {
      if (inSingle && value[index + 1] === "'") {
        index += 1
        continue
      }

      inSingle = !inSingle
      continue
    }

    if (char === '"' && !inSingle) {
      let slashCount = 0
      for (let cursor = index - 1; cursor >= 0 && value[cursor] === '\\'; cursor -= 1) {
        slashCount += 1
      }

      if (slashCount % 2 === 0) {
        inDouble = !inDouble
      }

      continue
    }

    if (!inSingle && !inDouble && char === ':') {
      const next = value[index + 1]
      if (next === undefined || /\s/.test(next)) {
        return index
      }
    }
  }

  return -1
}

const parseScalar = (value: string): YamlValue => {
  const normalized = stripInlineComment(value).trim()

  if (normalized.length === 0) {
    return ''
  }

  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }

  if (normalized === 'null' || normalized === '~') {
    return null
  }

  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(normalized)) {
    return Number(normalized)
  }

  if (normalized.startsWith('"') && normalized.endsWith('"')) {
    return JSON.parse(normalized)
  }

  if (normalized.startsWith("'") && normalized.endsWith("'")) {
    return normalized.slice(1, -1).replace(/''/g, "'")
  }

  return normalized
}

class YamlLiteParser {
  private readonly lines: string[]

  private index = 0

  constructor(input: string) {
    this.lines = input.replace(/\r\n?/g, '\n').split('\n')
  }

  parse(): YamlValue {
    this.skipIgnorable()

    if (this.index >= this.lines.length) {
      return {}
    }

    const indent = countIndent(this.lines[this.index], this.index + 1)
    const parsed = this.parseBlock(indent)

    this.skipIgnorable()

    if (this.index < this.lines.length) {
      throw new Error(`Line ${this.index + 1}: Unexpected trailing content in config.yaml.`)
    }

    return parsed
  }

  private skipIgnorable() {
    while (this.index < this.lines.length && isIgnorableLine(this.lines[this.index])) {
      this.index += 1
    }
  }

  private parseBlock(indent: number): YamlValue {
    this.skipIgnorable()

    if (this.index >= this.lines.length) {
      return {}
    }

    const line = this.lines[this.index]
    const currentIndent = countIndent(line, this.index + 1)

    if (currentIndent !== indent) {
      throw new Error(`Line ${this.index + 1}: Unexpected indentation in config.yaml.`)
    }

    const trimmed = line.slice(indent)
    return trimmed === '-' || trimmed.startsWith('- ') ? this.parseSequence(indent) : this.parseMapping(indent)
  }

  private parseMapping(indent: number, target: YamlObject = {}): YamlObject {
    while (this.index < this.lines.length) {
      const line = this.lines[this.index]

      if (isIgnorableLine(line)) {
        this.index += 1
        continue
      }

      const currentIndent = countIndent(line, this.index + 1)
      if (currentIndent < indent) {
        break
      }

      if (currentIndent > indent) {
        throw new Error(`Line ${this.index + 1}: Unexpected indentation in config.yaml.`)
      }

      const trimmed = line.slice(indent)
      if (trimmed === '-' || trimmed.startsWith('- ')) {
        break
      }

      const separatorIndex = findMappingSeparator(trimmed)
      if (separatorIndex === -1) {
        throw new Error(`Line ${this.index + 1}: Expected a key/value mapping in config.yaml.`)
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const remainder = trimmed.slice(separatorIndex + 1).trimStart()
      this.index += 1

      if (remainder === '|') {
        target[key] = this.parseBlockScalar(currentIndent)
        continue
      }

      if (remainder.length === 0) {
        this.skipIgnorable()

        if (this.index >= this.lines.length) {
          target[key] = {}
          continue
        }

        const nextIndent = countIndent(this.lines[this.index], this.index + 1)
        if (nextIndent <= currentIndent) {
          target[key] = {}
          continue
        }

        target[key] = this.parseBlock(nextIndent)
        continue
      }

      target[key] = parseScalar(remainder)
    }

    return target
  }

  private parseSequence(indent: number): YamlValue[] {
    const items: YamlValue[] = []

    while (this.index < this.lines.length) {
      const line = this.lines[this.index]

      if (isIgnorableLine(line)) {
        this.index += 1
        continue
      }

      const currentIndent = countIndent(line, this.index + 1)
      if (currentIndent < indent) {
        break
      }

      if (currentIndent > indent) {
        throw new Error(`Line ${this.index + 1}: Unexpected indentation in config.yaml.`)
      }

      const trimmed = line.slice(indent)
      if (!(trimmed === '-' || trimmed.startsWith('- '))) {
        break
      }

      const remainder = trimmed.slice(1).trimStart()
      this.index += 1

      if (remainder.length === 0) {
        this.skipIgnorable()

        if (this.index >= this.lines.length) {
          items.push(null)
          continue
        }

        const nextIndent = countIndent(this.lines[this.index], this.index + 1)
        if (nextIndent <= currentIndent) {
          items.push(null)
          continue
        }

        items.push(this.parseBlock(nextIndent))
        continue
      }

      const separatorIndex = findMappingSeparator(remainder)
      if (separatorIndex !== -1) {
        const key = remainder.slice(0, separatorIndex).trim()
        const inlineValue = remainder.slice(separatorIndex + 1).trimStart()
        const item: YamlObject = {}

        if (inlineValue === '|') {
          item[key] = this.parseBlockScalar(currentIndent)
        } else if (inlineValue.length === 0) {
          this.skipIgnorable()

          if (this.index >= this.lines.length) {
            item[key] = {}
          } else {
            const nextIndent = countIndent(this.lines[this.index], this.index + 1)
            item[key] = nextIndent > currentIndent ? this.parseBlock(nextIndent) : {}
          }
        } else {
          item[key] = parseScalar(inlineValue)
        }

        this.parseMapping(currentIndent + 2, item)
        items.push(item)
        continue
      }

      items.push(parseScalar(remainder))
    }

    return items
  }

  private parseBlockScalar(parentIndent: number): string {
    const content: string[] = []
    let contentIndent: number | null = null

    while (this.index < this.lines.length) {
      const line = this.lines[this.index]

      if (line.trim().length === 0) {
        content.push('')
        this.index += 1
        continue
      }

      const currentIndent = countIndent(line, this.index + 1)
      if (currentIndent <= parentIndent) {
        break
      }

      if (contentIndent === null) {
        contentIndent = currentIndent
      }

      if (currentIndent < contentIndent) {
        break
      }

      content.push(line.slice(contentIndent))
      this.index += 1
    }

    return content.join('\n').replace(/\n+$/, '')
  }
}

export const parseYaml = (input: string) => new YamlLiteParser(input).parse()

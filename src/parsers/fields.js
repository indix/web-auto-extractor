export const fieldType = {
  META: 'meta'
}

export const ParsedItem = function (type, name, value, selector) {
  return {
    type,
    name,
    value,
    selector
  }
}

export const Selector = function (cssSelector, attribute) {
  return {
    cssSelector,
    attribute
  }
}

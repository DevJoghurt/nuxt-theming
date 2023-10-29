/**
 * 
 * A prop name in vue can be 'colorChip' or 'color-chip'.
 * This function converts the prop name to the other format and returns both
 * 
 * */
export function convertPropName(name: string) : [string, string] {
  const camelCase = name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  const kebabCase = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  return [camelCase, kebabCase];
}


export function convertComponentName(name: string) : [string, string] {
    const kebabCase = name
        .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .toLowerCase()

    const pascalCase = name
        .replace(/-([a-z])/g, (match, group) => group.toUpperCase()) // Convert kebab-case to PascalCase
        .replace(/\s+/g, '') // Remove spaces
        .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter

    return [ kebabCase, pascalCase ]
}

export function extractClasses(fileContent: string, searchPattern: string) {
    const matchedClasses = [] as string[]
    let currentIndex = 0
  
    while (currentIndex !== -1) {
      currentIndex = fileContent.indexOf(searchPattern, currentIndex)
      if (currentIndex !== -1) {
        let start = currentIndex
        // Find the start of the class
        while (start >= 0 && /[^\s"'`]/.test(fileContent[start])) {
            start--
        }
        let end = currentIndex
        // Find the end of the class
        while (end < fileContent.length && /[^\s"'`]/.test(fileContent[end])) {
            end++
        }
        const classString = fileContent.slice(start + 1, end)
        if(!matchedClasses.includes(classString)){
          matchedClasses.push(classString)
        }
        // Move the currentIndex forward to avoid infinite loop
        currentIndex = end
      }
    }
    return matchedClasses
  }
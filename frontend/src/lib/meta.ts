type MetaTag = {
  name?: string
  property?: string
  content: string
}

export function updateMetaTags(metaTags: MetaTag[]) {
  const filteredTags = metaTags.filter((tag) => tag.content !== undefined)

  filteredTags.forEach((tag) => {
    const attributeType = tag.name ? "name" : "property"
    const attributeValue = tag.name || tag.property
    let metaTag = document.querySelector(`meta[${attributeType}="${attributeValue}"]`)
    if (metaTag) {
      metaTag.setAttribute("content", tag.content)
    } else {
      metaTag = document.createElement("meta")
      metaTag.setAttribute(attributeType, attributeValue!)
      metaTag.setAttribute("content", tag.content)
      document.head.appendChild(metaTag)
    }
  })
}

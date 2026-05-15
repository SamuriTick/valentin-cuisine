import { mergeAttributes } from '@tiptap/core'
import TiptapImage from '@tiptap/extension-image'

export interface ImageOptions {
  inline: boolean
  allowBase64: boolean
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: { src: string; alt?: string; title?: string; width?: string; alignment?: string }) => ReturnType
      updateImageAttributes: (attrs: { width?: string; alignment?: string; alt?: string }) => ReturnType
    }
  }
}

export const CustomImage = TiptapImage.extend<ImageOptions>({
  name: 'customImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: '100',
        parseHTML: element => element.getAttribute('data-width') || '100',
        renderHTML: attributes => ({
          'data-width': attributes.width,
          style: `width: ${attributes.width}%; max-width: 100%;`,
        }),
      },
      alignment: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-alignment') || 'center',
        renderHTML: attributes => ({ 'data-alignment': attributes.alignment }),
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { alignment, ...rest } = HTMLAttributes
    const alignClass =
      alignment === 'left' ? 'float-left mr-4 mb-4' :
      alignment === 'right' ? 'float-right ml-4 mb-4' :
      'mx-auto block'
    return ['img', mergeAttributes(this.options.HTMLAttributes, rest, {
      class: `${alignClass} h-auto rounded my-4`,
    })]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImage: (options: any) => ({ commands }) => {
        const width = typeof options.width === 'number' ? String(options.width) : (options.width || '100')
        return commands.insertContent({
          type: this.name,
          attrs: { src: options.src, alt: options.alt || '', title: options.title || '', width, alignment: options.alignment || 'center' },
        })
      },
      updateImageAttributes: (attrs) => ({ commands }) => commands.updateAttributes(this.name, attrs),
    }
  },
})

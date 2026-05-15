'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import { CustomImage } from './ImageExtension'
import { ImageUploadWidget } from './ImageUploadWidget'
import { ImageSizeControl } from './ImageSizeControl'

interface Props {
  content: any
  onChange: (json: any, html: string) => void
  placeholder?: string
  editable?: boolean
}

export function TipTapEditor({ content, onChange, placeholder = 'Start writing…', editable = true }: Props) {
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showImageControl, setShowImageControl] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit,
      CustomImage.configure({ inline: false, allowBase64: false, HTMLAttributes: {} }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || { type: 'doc', content: [{ type: 'paragraph' }] },
    editable,
    onUpdate: ({ editor }) => onChange(editor.getJSON(), editor.getHTML()),
    onSelectionUpdate: ({ editor }) => setShowImageControl(editor.isActive('customImage')),
    editorProps: {
      attributes: { class: 'prose prose-slate max-w-none focus:outline-none min-h-[400px] px-6 py-5' },
    },
  })

  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const btn = (active: boolean) => ({
    padding: '5px 10px', fontSize: 12, cursor: 'pointer', borderRadius: 4, border: '1px solid',
    borderColor: active ? '#1a1a1a' : '#e8e3dc',
    background: active ? '#1a1a1a' : '#fff',
    color: active ? '#fff' : '#5A5040',
    fontWeight: 500,
  } as React.CSSProperties)

  const divider = <div style={{ width: 1, background: '#e8e3dc', margin: '0 4px', alignSelf: 'stretch' }} />

  return (
    <div style={{ border: '1px solid #e8e3dc', borderRadius: 8, overflow: 'hidden' }}>

      {editable && (
        <div style={{ borderBottom: '1px solid #e8e3dc', background: '#FAF8F4', padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>

          <button type="button" style={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
          <button type="button" style={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>

          {divider}

          <button type="button" style={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
          <button type="button" style={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>

          {divider}

          <button type="button" style={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
          <button type="button" style={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>

          {divider}

          <button type="button" style={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
          <button type="button" style={btn(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()}>Divider</button>

          {divider}

          <button type="button" style={btn(showImageUpload)} onClick={() => setShowImageUpload(v => !v)}>📷 Image</button>

          {divider}

          <button type="button" style={btn(false)} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↩ Undo</button>
          <button type="button" style={btn(false)} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↪ Redo</button>
        </div>
      )}

      <div style={{ background: '#fff', position: 'relative' }}>
        <EditorContent editor={editor} />
        {showImageUpload && (
          <ImageUploadWidget editor={editor} onClose={() => setShowImageUpload(false)} />
        )}
        {showImageControl && editable && (
          <ImageSizeControl editor={editor} onClose={() => setShowImageControl(false)} />
        )}
      </div>
    </div>
  )
}

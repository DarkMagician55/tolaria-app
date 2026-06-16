import { createExtension } from '@blocknote/core'

interface ComposingEditorView {
  composing?: boolean
}

function isComposingKeyEvent(event: KeyboardEvent, view?: ComposingEditorView | null): boolean {
  return event.isComposing || event.keyCode === 229 || Boolean(view?.composing)
}

function isEnterKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter'
    || event.code === 'Enter'
    || event.code === 'NumpadEnter'
    || event.keyCode === 13
}

function isTabKey(event: KeyboardEvent): boolean {
  return event.key === 'Tab'
    || event.code === 'Tab'
    || event.keyCode === 9
}

export function shouldStopComposingEnterKey(
  event: KeyboardEvent,
  view?: ComposingEditorView | null,
): boolean {
  return isEnterKey(event) && isComposingKeyEvent(event, view)
}

export function shouldStopComposingStructuralKey(
  event: KeyboardEvent,
  view?: ComposingEditorView | null,
): boolean {
  return (isEnterKey(event) || isTabKey(event)) && isComposingKeyEvent(event, view)
}

export const createImeCompositionKeyGuardExtension = createExtension(({ editor }) => {
  const readView = () => editor._tiptapEditor?.view ?? editor.prosemirrorView

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!shouldStopComposingStructuralKey(event, readView())) return

    event.stopImmediatePropagation()
  }

  return {
    key: 'imeCompositionKeyGuard',
    mount: ({ dom, signal }) => {
      dom.addEventListener('keydown', handleKeyDown, {
        capture: true,
        signal,
      })
    },
  } as const
})

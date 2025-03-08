'use client'
import { useRef, useState } from 'react'

export default function CodeRunner(props: { code: string | null; language: string | null }) {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [htmlResult, setHtmlResult] = useState<string | null>(null)
  return (
    <>
      <button
        className="btn btn-sm btn-outline text-white px-5 absolute top-2 right-2"
        onClick={() => {
          modalRef.current?.showModal()
          if (props.language === 'html') {
            setHtmlResult(props.code)
          } else {
            setHtmlResult(null)
            setLoading(true)
            fetch('/api/run-code', {
              method: 'POST',
              body: JSON.stringify({ code: props.code, language: props.language }),
            })
              .then(res => res.json())
              .then(data => {
                setResult(data.result)
              })
              .finally(() => setLoading(false))
          }
        }}
      >
        Run
      </button>
      <dialog ref={modalRef} className="modal" style={{ color: 'initial' }}>
        <div className="modal-box max-h-[90vh] min-h-[50vh] max-w-[900px] overflow-y-auto">
          <form method="dialog" className="sticky top-0 z-10">
            <button className="btn btn-sm btn-circle btn-ghost select-none absolute font-bold !text-base -right-3 -top-3">
              ✕
            </button>
          </form>
          <p className="!mt-0 mb-2">运行结果：</p>

          {htmlResult ? (
            <div className="mockup-browser border border-base-300 w-full">
              <div className="mockup-browser-toolbar">
                <div className="input">https://example.com</div>
              </div>
              <iframe
                onLoad={e => {
                  if (e.target instanceof HTMLIFrameElement && e.target.contentDocument) {
                    e.target.style.height = e.target.contentDocument.body.clientHeight + 50 + 'px'
                  }
                }}
                srcDoc={htmlResult}
                className="w-full   border-none"
              ></iframe>
            </div>
          ) : (
            <div className="mockup-code">
              {loading ? (
                <div className="mx-4">
                  <div className="skeleton invert-80 h-4 w-full"></div>
                  <div className="skeleton invert-80 h-4 w-full mt-3"></div>
                </div>
              ) : (
                <pre>
                  <code className="text-sm">{result}</code>
                </pre>
              )}
            </div>
          )}
          <div className="modal-action hidden">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

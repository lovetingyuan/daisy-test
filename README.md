Run
`npm install & npm run dev`

Open the Performance Monitor panel in the browser console, quickly enter any text continuously in the textarea, and observe the GPU usage. You will see a significant increase in usage.

---

Then, remove the daisy from `index.css`, and repeat the above steps. You will see that the CPU usage has returned to normal.

or

You can also change the `Textarea` component in `App.tsx` to an uncontrolled component.
`<Textarea control={false} />`.
When typing quickly again, the CPU usage remains at a normal level.

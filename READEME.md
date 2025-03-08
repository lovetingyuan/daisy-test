run
`npm install & npm run dev`

In a textarea, continuously and rapidly inputting text, then opening the performance panel in the console to observe the CPU usage, it will abnormally reach 90%. Normally, a CPU usage of around 30% is considered normal.


------------


And then you can comment the daisy usage in `index.css`

```css
// try to remove this
@plugin "daisyui" {
  include: textarea, tab;
}
```

By repeating the test method mentioned above, you will observe that the CPU usage returns to normal.
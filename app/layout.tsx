import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'i13r',
  description: 'let us become 🐂 & 🐎',
}

function hideStaticIndicator() {
  const portalElement = document.querySelector('nextjs-portal')

  if (portalElement) {
    const style = document.createElement('style')
    style.textContent = `
    .nextjs-static-indicator-toast-wrapper {
      display: none!important;
    }
    `
    // 插入到 shadowRoot 或元素内部
    if (portalElement.shadowRoot) {
      // 如果使用 Shadow DOM
      portalElement.shadowRoot.appendChild(style)
    } else {
      // 如果使用普通 DOM
      portalElement.appendChild(style)
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Script
        id="hideStaticIndicator"
        strategy="afterInteractive"
      >{`(${hideStaticIndicator})()`}</Script>
      {/* <Script
        crossOrigin="anonymous"
        id="react-scan"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      /> */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}

import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })

// Mobile viewport (iPhone 14 Pro)
const mobile = await browser.newPage()
await mobile.setViewportSize({ width: 390, height: 844 })
await mobile.goto('http://localhost:5173/MeuDashboard/', { waitUntil: 'networkidle' })
await mobile.screenshot({ path: 'mobile-overview.png', fullPage: true })

// Tablet
const tablet = await browser.newPage()
await tablet.setViewportSize({ width: 768, height: 1024 })
await tablet.goto('http://localhost:5173/MeuDashboard/', { waitUntil: 'networkidle' })
await tablet.screenshot({ path: 'tablet-overview.png', fullPage: false })

await browser.close()
console.log('Screenshots saved')

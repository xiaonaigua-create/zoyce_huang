import * as React from "react"
import { cn } from "@/lib/utils"
import { balloons, textBalloons } from "balloons-js"

export interface BalloonsProps {
  type?: "default" | "text"
  text?: string
  fontSize?: number
  color?: string
  className?: string
  onLaunch?: () => void
}

const Balloons = React.forwardRef<HTMLDivElement, BalloonsProps>(
  ({ type = "default", text, fontSize = 120, color = "#000000", className, onLaunch }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const styleTagRef = React.useRef<HTMLStyleElement | null>(null)

    const launchAnimation = React.useCallback(() => {
      if (type === "default") {
        // ── 方案：注入全局 <style> 规则，用 :nth-child 覆盖每个气球的颜色 ──
        // balloons-js 创建 <balloons><balloon>...<balloon></balloons>
        // CSS 选择器天然匹配，不依赖 JS 时序，零遗漏
        if (!styleTagRef.current) {
          const style = document.createElement('style')
          style.setAttribute('data-purple-balloons', '')
          // 用 nth-child 循环分配紫白色系，覆盖足够多的子元素
          style.textContent = `
            balloons balloon:nth-child(5n+1) { --balloon-color: #9333ea !important; --light-color: #f3e8ff !important; }
            balloons balloon:nth-child(5n+2) { --balloon-color: #F5F0E8 !important; --light-color: #EDE4D0 !important; }
            balloons balloon:nth-child(5n+3) { --balloon-color: #7C3AED !important; --light-color: #ede9fe !important; }
            balloons balloon:nth-child(5n+4) { --balloon-color: #FAF6EE !important; --light-color: #E8DFCC !important; }
            balloons balloon:nth-child(5n+0) { --balloon-color: #A855F7 !important; --light-color: #faf5ff !important; }
          `
          document.head.appendChild(style)
          styleTagRef.current = style
        }

        balloons()

        // 10秒后移除样式标签（气球动画早已结束）
        setTimeout(() => {
          styleTagRef.current?.remove()
          styleTagRef.current = null
        }, 10000)

      } else if (type === "text" && text) {
        textBalloons([
          {
            text,
            fontSize,
            color,
          },
        ])
      }

      if (onLaunch) {
        onLaunch()
      }
    }, [type, text, fontSize, color, onLaunch])

    // Expose launchAnimation via ref
    React.useImperativeHandle(ref, () => ({
      launchAnimation,
      ...(containerRef.current || {})
    }), [launchAnimation])

    return <div ref={containerRef} className={cn("balloons-container", className)} />
  }
)
Balloons.displayName = "Balloons"

export { Balloons }

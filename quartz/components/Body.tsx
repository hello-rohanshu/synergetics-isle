// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
// @ts-ignore
import anchorsScript from "./scripts/anchors.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = [clipboardScript, anchorsScript]
Body.css = clipboardStyle

export default (() => Body) satisfies QuartzComponentConstructor
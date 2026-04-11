// @ts-ignore
import feedbackScript from "./scripts/feedback.inline"
import styles from "./styles/feedback.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Feedback: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <>
      <button class={classNames(displayClass, "feedback-button")} aria-label="Send Feedback">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c-2 .2-3.53 1.9-3.53 3.8"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
        </svg>
      </button>

      <div class="feedback-modal">
        <div class="feedback-content">
          <h3>Send Feedback</h3>
          
          <select id="feedback-type">
            <option value="bug">Bug Report</option>
            <option value="content">Content Issue</option>
            <option value="suggestion">Suggestion</option>
          </select>

          <select id="feedback-area">
            <option value="ui">User Interface</option>
            <option value="text">Text / Content</option>
            <option value="other">Other</option>
          </select>

          <textarea id="feedback-message" placeholder="What's on your mind?"></textarea>

          <div id="feedback-status"></div>

          <div class="feedback-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="submit-btn">Submit</button>
          </div>
        </div>
      </div>
    </>
  )
}

Feedback.beforeDOMLoaded = feedbackScript
Feedback.css = styles

export default (() => Feedback) satisfies QuartzComponentConstructor
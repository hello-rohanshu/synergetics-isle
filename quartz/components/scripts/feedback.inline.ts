document.addEventListener("nav", () => {
  const btn = document.querySelector(".feedback-button") as HTMLButtonElement | null
  const modal = document.querySelector(".feedback-modal") as HTMLDivElement | null
  const cancelBtn = document.querySelector(".cancel-btn") as HTMLButtonElement | null
  const submitBtn = document.querySelector(".submit-btn") as HTMLButtonElement | null
  
  const typeSelect = document.getElementById("feedback-type") as HTMLSelectElement | null
  const areaSelect = document.getElementById("feedback-area") as HTMLSelectElement | null
  const msgInput = document.getElementById("feedback-message") as HTMLTextAreaElement | null
  const statusDiv = document.getElementById("feedback-status") as HTMLDivElement | null

  if (!btn || !modal) return;

  const openModal = () => modal.classList.add("open")
  const closeModal = () => {
    modal.classList.remove("open")
    if (statusDiv) statusDiv.style.display = "none"
    if (msgInput) msgInput.value = "" // reset message
  }

  // Event Listeners for UI
  btn.addEventListener("click", openModal)
  cancelBtn?.addEventListener("click", closeModal)

  // Close when clicking on the blurred background overlay
  const outsideClick = (e: MouseEvent) => {
    if (e.target === modal) closeModal()
  }
  window.addEventListener("click", outsideClick)

  // API Call Logic
  const submitFeedback = async () => {
    if (!typeSelect || !areaSelect || !msgInput || !statusDiv || !submitBtn) return
    
    if (!msgInput.value.trim()) {
       statusDiv.style.display = "block"
       statusDiv.innerText = "Message cannot be empty."
       return
    }

    const payload = {
      type: typeSelect.value,
      area: areaSelect.value,
      message: msgInput.value,
      url: window.location.href // Automatically grab current page
    }

    submitBtn.disabled = true
    statusDiv.style.display = "block"
    statusDiv.innerText = "Submitting..."

    try {
      // REPLACE WITH YOUR CLOUDFLARE WORKER URL
      const res = await fetch("https://synergetics-feedback-worker.rohanshu.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const data = (await res.json()) as { ok: boolean; issue_url?: string }

      if (data.ok && data.issue_url) {
        statusDiv.innerHTML = `✅ <a href="${data.issue_url}" target="_blank" rel="noopener">Issue created successfully!</a>`
        msgInput.value = "" 
      } else {
        statusDiv.innerText = "❌ Failed to create issue."
      }
    } catch (err) {
      statusDiv.innerText = "❌ Network error."
    } finally {
      submitBtn.disabled = false
    }
  }

  submitBtn?.addEventListener("click", submitFeedback)

  // Quartz SPA Cleanup
  window.addCleanup(() => {
    btn.removeEventListener("click", openModal)
    cancelBtn?.removeEventListener("click", closeModal)
    window.removeEventListener("click", outsideClick)
    submitBtn?.removeEventListener("click", submitFeedback)
  })
})
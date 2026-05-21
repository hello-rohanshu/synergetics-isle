#!/usr/bin/env python3
"""
Usage: python patch_frontmatter.py /path/to/content/systems

For every .md file directly in DIR:
- Clears ping_url value (keeps the key, empties the value)
- Sets url to known domain if blank or wrong
- Leaves everything else untouched
"""

import sys, os, re

DIR = sys.argv[1] if len(sys.argv) > 1 else "."

KNOWN_URLS = {
    "cerebras":                          "https://cerebras.ai",
    "groq":                              "https://groq.com",
    "cloudflare worker":                 "https://cloudflare.com",
    "cloudflare hosting":                "https://cloudflare.com",
    "cloudflare ai search":              "https://cloudflare.com",
    "worker":                            "https://cloudflare.com",
    "fastapi app on huggingface spaces": "https://huggingface.co",
    "qdrant":                            "https://qdrant.tech",
    "github":                            "https://github.com",
    "obsidian":                          "https://obsidian.md",
    "quartz":                            "https://quartz.jzhao.xyz",
    "uptime robot":                      "https://uptimerobot.com",
    "claude":                            "https://claude.ai",
    "r. w. gray's synergetics online":   "https://rwgrayprojects.com",
    "synergetics":                       "https://rwgrayprojects.com",
    "hosting":                           "https://cloudflare.com",
    "version control":                   "https://github.com",
    "local markdown editor":             "https://obsidian.md",
    "site builder":                      "https://quartz.jzhao.xyz",
    "keepalive services":                "https://uptimerobot.com",
    "embedding":                         "https://huggingface.co",
    "vector store":                      "https://qdrant.tech",
    "generation service":                "https://cerebras.ai",
    "rag pipeline":                      "https://cloudflare.com",
    "coding and research":               "https://claude.ai",
    "gpt-oss-120b":                      "https://cerebras.ai",
    "llama-3.3-70b-versatile":           "https://groq.com",
    "github":                            "https://github.com",
    "embedding":                         "https://huggingface.co",
}

def process(path):
    fname = os.path.basename(path)
    key = os.path.splitext(fname)[0].lower()

    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    # Clear ping_url value
    text = re.sub(r"^(ping_url\s*:).*$", r"\1", text, flags=re.MULTILINE)

    # Set url if we know it
    domain = KNOWN_URLS.get(key)
    if domain:
        if re.search(r"^url\s*:", text, re.MULTILINE):
            text = re.sub(r"^(url\s*:).*$", rf"\1 {domain}", text, flags=re.MULTILINE)
        else:
            text = re.sub(r"^(ping_url\s*:.*)$", rf"\1\nurl: {domain}", text, flags=re.MULTILINE)

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"  done: {fname}")

def main():
    files = [f for f in os.listdir(DIR)
             if f.endswith(".md") and os.path.isfile(os.path.join(DIR, f))]
    print(f"Processing {len(files)} files\n")
    for f in sorted(files):
        process(os.path.join(DIR, f))
    print("\nDone.")

if __name__ == "__main__":
    main()
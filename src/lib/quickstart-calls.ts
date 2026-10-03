/**
 * The quickstart's four calls, as data: real requests against api.esy.com with
 * their real responses pasted back (run-fb0677b2, 2026-09-13). The quickstart
 * page renders them, and the homepage prototypes replay the same run, so the
 * two can never show different numbers.
 */

export const createRun = `curl -X POST https://api.esy.com/v1/runs \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "templateId": "generate-illustration",
    "intake": {
      "prompt": "a lighthouse at dusk, storm rolling in",
      "style": "flat",
      "aspectRatio": "4:3",
      "quality": "low",
      "categories": "landscapes"
    }
  }'`;

export const createResponse = `{
  "id": "run-fb0677b2",
  "status": "pending",
  "templateId": "generate-illustration",
  "templateName": "Generate Illustration",
  "currentStepIndex": 0,
  "workflowVersion": "2026.09.09",
  "specVersionHash": "sha256:eb3ced0c91a625e7ad47beaa28f5ff7b6db933ca5f6cac78fb93c1b030852fdb",
  "createdVia": "api_key",
  "queuedAt": "2026-09-13T00:16:58.843436Z"
}`;

export const pollRun = `curl -s https://api.esy.com/v1/runs/run-fb0677b2 \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

export const finishedRun = `{
  "id": "run-fb0677b2",
  "status": "completed",
  "artifactId": "artifact-5a6a9501",
  "durationMs": 16088,
  "totalCosts": {
    "estimatedUsd": 0.007749,
    "actualUsd": 0.007749,
    "currency": "USD",
    "status": "provider_reported"
  }
}`;

export const getArtifact = `curl -s https://api.esy.com/v1/artifacts/artifact-5a6a9501 \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

export const artifactResponse = `{
  "id": "artifact-5a6a9501",
  "runId": "run-fb0677b2",
  "templateId": "generate-illustration",
  "title": "Lighthouse at Dusk with Storm Rolling In",
  "status": "ready",
  "artifactClass": "visual",
  "artifactType": "illustration",
  "version": 1,
  "content": {
    "type": "image",
    "url": "https://images.esy.com/artifacts/illustration/run-fb0677b2/image.webp",
    "mimeType": "image/webp",
    "model": "gpt-image-2.5-sunburst"
  },
  "qa": {
    "status": "pending_review",
    "checks": [
      { "id": "text-gate", "label": "Text gate", "status": "pass", "detail": "" }
    ]
  }
}`;

export const script = `#!/usr/bin/env bash
# Start a run, wait for it, print the artifact URL.
set -euo pipefail

RUN=$(curl -s -X POST https://api.esy.com/v1/runs \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{"templateId":"generate-illustration","intake":{"prompt":"a lighthouse at dusk","style":"flat","aspectRatio":"4:3","quality":"low","categories":"landscapes"}}')

ID=$(echo "$RUN" | jq -r .id)
echo "run $ID"

# Poll until the run reaches a terminal status.
while :; do
  sleep 5
  STATUS=$(curl -s "https://api.esy.com/v1/runs/$ID" \\
    -H "Authorization: Bearer $ESY_API_KEY" | jq -r .status)
  echo "  $STATUS"
  case "$STATUS" in completed|review|failed|cancelled) break ;; esac
done

ART=$(curl -s "https://api.esy.com/v1/runs/$ID" \\
  -H "Authorization: Bearer $ESY_API_KEY" | jq -r .artifactId)

curl -s "https://api.esy.com/v1/artifacts/$ART" \\
  -H "Authorization: Bearer $ESY_API_KEY" | jq -r .content.url`;

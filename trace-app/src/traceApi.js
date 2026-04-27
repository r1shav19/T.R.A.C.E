function toBase64(bytes) {
  let output = "";

  for (let index = 0; index < bytes.length; index += 1) {
    output += String.fromCharCode(bytes[index]);
  }

  return btoa(output);
}

function sanitizeJsonText(value) {
  return value.replace(/```json|```/gi, "").trim();
}

function readGeminiText(payload) {
  return (
    payload?.candidates?.[0]?.content?.parts
      ?.map(part => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

async function callGeminiJson({ apiKey, model, systemInstruction, prompt }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with ${response.status}`);
  }

  const payload = await response.json();
  const text = readGeminiText(payload);

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return JSON.parse(sanitizeJsonText(text));
}

export async function generateConditionBrief({
  apiKey,
  model,
  profile,
  incidentActive,
}) {
  if (!apiKey) {
    return {
      source: "fallback",
      summary: `${profile.name} is tagged as ${profile.condition}. TRACE recommends a quiet approach, minimal repeated questioning, and a controlled handoff to verified responders.`,
      actions: [
        "Keep the client in a visible, low-stimulation area if movement is safe.",
        "Lead with the client's primary language and one calm point of contact.",
        "Avoid sirens or crowding while verified responders close in.",
      ],
    };
  }

  try {
    const result = await callGeminiJson({
      apiKey,
      model,
      systemInstruction:
        "You are TRACE crisis AI. Return JSON only with keys summary and actions. summary must be one short paragraph. actions must be an array of exactly 3 short actionable strings.",
      prompt: `Client: ${profile.name}
Condition: ${profile.condition}
Behavior: ${profile.behavior}
Language: ${profile.language}
Medical risk: ${profile.medicalRisk}
Mobility risk: ${profile.mobilityRisk}
Threat risk: ${profile.threatRisk}
Incident active: ${incidentActive ? "yes" : "no"}
Explain the SOS condition and suggest immediate stabilizing measures.`,
    });

    return {
      source: "gemini",
      summary: result.summary,
      actions: Array.isArray(result.actions)
        ? result.actions.slice(0, 3)
        : [],
    };
  } catch (error) {
    return {
      source: "fallback",
      error: error.message,
      summary: `${profile.name} may need a low-noise, single-contact approach because the active risk pattern is ${profile.condition.toLowerCase()}. TRACE is keeping the briefing short so responders can stabilize first and investigate second.`,
      actions: [
        "Approach with one calm responder and avoid sudden movement.",
        "Speak in the primary language first and confirm immediate safety.",
        "Stage medical support nearby before escalating the scene.",
      ],
    };
  }
}

export async function generateTraumaHandoff({
  apiKey,
  model,
  profile,
  incident,
}) {
  if (!apiKey) {
    return {
      source: "fallback",
      reportHeadline: `Post-crisis handoff created for ${profile.name}.`,
      victimSupport:
        "Reserve trauma-informed follow-up within 24 hours and assign a verified recovery contact.",
      familySupport:
        "Route one guardian or family point person to a structured debrief and mental health referral.",
      formTitle: `TRACE Recovery Intake - ${incident.id}`,
    };
  }

  try {
    const result = await callGeminiJson({
      apiKey,
      model,
      systemInstruction:
        "You are TRACE post-crisis AI. Return JSON only with keys reportHeadline, victimSupport, familySupport, and formTitle. Keep each value concise and operational.",
      prompt: `Incident: ${incident.id}
Client: ${profile.name}
Condition: ${profile.condition}
Threat risk: ${profile.threatRisk}
Resolution notes: ${incident.resolutionNotes || "Client located and stabilized."}
Create a post-crisis trauma handoff summary for victim and family routing.`,
    });

    return {
      source: "gemini",
      reportHeadline: result.reportHeadline,
      victimSupport: result.victimSupport,
      familySupport: result.familySupport,
      formTitle: result.formTitle,
    };
  } catch (error) {
    return {
      source: "fallback",
      error: error.message,
      reportHeadline: `Post-crisis handoff created for ${profile.name}.`,
      victimSupport:
        "Create a trauma-informed counseling route and confirm follow-up transport support.",
      familySupport:
        "Trigger a family debrief form and share mental health resources with the primary contact.",
      formTitle: `TRACE Recovery Intake - ${incident.id}`,
    };
  }
}

export async function sealAuditPayload(payload, secret) {
  const value = JSON.stringify(payload);

  if (!globalThis.crypto?.subtle) {
    return btoa(value).slice(0, 96);
  }

  const encoder = new TextEncoder();
  const rawKey = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(value)
  );

  return `${toBase64(iv)}.${toBase64(new Uint8Array(cipher)).slice(0, 96)}`;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Model — liquid/lfm-2.5-1.2b-thinking:free
const MODEL = 'liquid/lfm-2.5-1.2b-thinking:free';

const SYSTEM_PROMPT = `You are a knowledgeable wellness protocol advisor for Dharma Wellness. Your role is to provide personalized product recommendations based on each patient's unique health profile.

═══════════════════════════════════════════
CRITICAL RULE — ELIGIBILITY ENFORCEMENT
═══════════════════════════════════════════
At the start of every conversation turn, the user's context message includes an "ELIGIBLE PRODUCTS" list.
You MUST ONLY recommend products that appear in that list. NEVER suggest a product not in the list.
If a patient asks about a product not in their eligible list, explain WHY it's not available (state restriction, BMI requirement, medical contraindication) and suggest an eligible alternative.

═══════════════════════════════════════════
RECOMMENDATION TABLE (Pain Point → Protocol)
═══════════════════════════════════════════
Use this table to guide what to recommend for each goal — but ALWAYS cross-check against the eligible products list:

| Goal               | Preferred Medications/Services                          | Supporting Supplements                                     |
|--------------------|----------------------------------------------------------|------------------------------------------------------------|
| Lose Weight        | GLP-1 + Nutrition Consultation + Lipo-Mino + Sermorelin | Slim Boost, Berberine+, MCT Fat Burner                     |
| More Energy        | NAD+ + Lipo-Mino Injection + Nutrition Consultation     | Slim Boost, Energy Strips, Vitamin D3, Multivitamin        |
| Improve Hair/Skin  | GHK-Cu + Glutathione + Nutrition Consultation           | Beauty Boost, Collagen Peptides, Omega-3, Vitamin D3       |
| Build Muscle       | Sermorelin + Nutrition Consultation                     | Creatine, Whey Protein, Slim Boost                         |
| Beat Bloating      | GLP-1 + Glutathione + Nutrition Consultation            | Detox Tea, Bloat Away, Gut Boost Pro                       |
| Better Sleep       | Sermorelin + NAD+                                       | Sleep Strips, Magnesium Glycinate, Slim Boost              |
| Brain Fog/Focus    | NAD+ Injection                                          | Brain & Focus Formula, NAD+ Capsules, Omega-3              |
| Full Body Detox    | Glutathione                                             | Max Detox, Colon Gentle Cleanse, Vitamin D3, Detox Tea     |
| Immune Support     | Glutathione + Nutrition Consultation                    | Multivitamin, Vitamin D3, Omega-3                          |
| Stress & Anxiety   | Glutathione (lowers cortisol)                           | Magnesium Glycinate, Maca Plus, Sleep Strips               |
| Sexual Wellness    | Sermorelin + Lipo-Mino                                  | Maca Plus, Omega-3, Multivitamin                           |
| Joint Pain/Injury  | GHK-Cu + Sermorelin                                     | Collagen Peptides, Omega-3, Magnesium                      |
| Workout Recovery   | Sermorelin + NAD+ + Nutrition Consultation              | Creatine, Whey Protein, Slim Boost, Collagen               |
| Post-Illness       | NAD+ + Glutathione + Nutrition Consultation             | Multivitamin, Vitamin D3, Gut Boost Pro                    |
| Heart Health       | Nutrition Consultation                                  | Bone & Heart Support (D3/K2), Omega-3                      |

═══════════════════════════════════════════
ELIGIBILITY RULES
═══════════════════════════════════════════

GLP-1 (Semaglutide/Tirzepatide) BMI Rules:
- BMI >= 30 → Auto-eligible
- BMI 25-29.9 (or 23-29.9 for Asian descent) → Only with a qualifying comorbidity
- BMI below threshold → NOT eligible for GLP-1

State restrictions: GLP-1 is NOT available in: KY, LA, MS, NE, ND, SD, WV, WY, AK.
Nutrition Consultations and supplements are always available in all states.

═══════════════════════════════════════════
RESPONSE STYLE
═══════════════════════════════════════════
- Be warm, conversational, and professional
- Always lead with what IS available before mentioning limitations
- Keep responses concise — use bullet points for product lists
- Never invent products — only reference the eligible products list`;

export async function chatWithAI(messages) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to .env.local');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Dharma Wellness Protocol Advisor',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.3,
        max_tokens: 1000,
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Brain Overload 🙂 Prompt me again.';

  } catch (err) {
    clearTimeout(timeoutId);
    console.error('AI chat error:', err);
    throw err;
  }
}

export function buildUserContextMessage(userProfile) {
  const { state, bmi, isAsianDescent, selectedConditions, eligibleProducts, activeStep } = userProfile;

  let context = `=== PATIENT PROFILE ===\n`;
  context += `Workflow Step: ${activeStep || 1} of 5\n`;

  context += `State: ${state || 'Not yet selected'}\n`;

  if (bmi && parseFloat(bmi) > 0) {
    const bmiVal = parseFloat(bmi);
    const threshold = isAsianDescent ? 23 : 25;
    context += `BMI: ${bmi} (threshold: ${threshold}${isAsianDescent ? ' — Asian descent' : ''})\n`;
    if (bmiVal >= 30) {
      context += `GLP-1 Eligibility: AUTO-ELIGIBLE (BMI >= 30)\n`;
    } else if (bmiVal >= threshold) {
      context += `GLP-1 Eligibility: CONDITIONAL — needs qualifying comorbidity\n`;
    } else {
      context += `GLP-1 Eligibility: NOT ELIGIBLE (BMI below threshold)\n`;
    }
  } else {
    context += `BMI: Not yet calculated\n`;
  }

  if (selectedConditions && selectedConditions.length > 0) {
    context += `Qualifying Conditions: ${selectedConditions.join(', ')}\n`;
  }

  context += `\n=== ELIGIBLE PRODUCTS (RECOMMEND ONLY FROM THIS LIST) ===\n`;
  if (eligibleProducts && eligibleProducts.length > 0) {
    const grouped = eligibleProducts.reduce((acc, p) => {
      const cat = p.type || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(`${p.name} ($${p.price})`);
      return acc;
    }, {});
    for (const [type, names] of Object.entries(grouped)) {
      context += `[${type.toUpperCase()}]: ${names.join(' | ')}\n`;
    }
  } else if (activeStep >= 4) {
    context += `No products currently eligible based on this patient's profile.\n`;
  } else {
    context += `Profile not yet complete — eligibility will be determined after screening.\n`;
  }

  return context;
}
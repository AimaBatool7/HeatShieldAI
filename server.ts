import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for HeatShield Climate Intelligence Advisor
const HEATSHIELD_SYSTEM_INSTRUCTION = `You are the HeatShield Climate Intelligence Advisor, an advanced urban microclimate and heat resilience intelligence system.
Your mission is to provide accurate, scientifically grounded, life-saving advice and practical operational strategies to protect citizens, outdoor workers, schoolchildren, urban infrastructure, and energy grids from extreme heat and heatwaves.

Guidelines:
1. Directly ground your answers in the provided city telemetry: ambient temperature (measured at 2m above ground level), relative humidity, calculated heat index, risk score (0-100), risk level (e.g., Extreme, Critical, High, Moderate), trend, and neighborhood-level hotspot microclimates.
2. Structure your answers with clean Markdown (headers, bullet points, bold key terms) for maximum readability during emergency and operational planning.
3. Categorize recommendations where appropriate:
   - Individual & Public Safety (hydration protocols, vulnerable populations, outdoor worker protection, warning signs of heat stroke/exhaustion).
   - Municipal Interventions (emergency cooling centers, mist cannons, reflective surfaces, water distribution hubs).
   - Infrastructure & Power Grid (preventing transformer failures, peak cooling load management, adjusting commercial thermostats to 26°C).
   - Schools & Community (canceling midday outdoor drills, modified shifts).
4. Tone: Authoritative, calm, empathetic, and action-oriented.
5. Emphasize that advice is for urban safety and resilience planning, advising immediate medical attention for active heat stroke cases.`;

// Resilient Gemini generator with multi-model fallback
async function generateWithGemini(prompt: string, systemInstruction: string = HEATSHIELD_SYSTEM_INSTRUCTION) {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured. Please add your GEMINI_API_KEY in the AI Studio Settings > Secrets panel.');
  }

  // Priority order: 3.6 Flash (high-availability & fast) -> 3.7 Flash -> 3.1 Flash Lite -> Flash Latest
  const candidateModels = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`Gemini generation with model ${model} failed (${errMsg.slice(0, 120)}), trying next candidate...`);
      // Immediately fallback to next candidate model in list
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini AI models.');
}

// Heuristic fallback generator if API key is missing or offline
function generateFallbackAdvice(message: string, context: any): string {
  const city = context?.cityName || 'the city';
  const temp = context?.temperature || '42';
  const risk = context?.riskLevel || 'HIGH';

  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('school') || lowerMsg.includes('children')) {
    return `### HeatShield Advisory: School & Student Safety for ${city} (${temp}°C - ${risk})
1. **Curfew on Outdoor Athletics**: Immediately suspend all mid-day physical education and sports between 11:00 AM and 5:00 PM.
2. **Hydration Breaks**: Mandate scheduled 20-minute water breaks in classrooms. Ensure school water filtration tanks are chilled and shaded.
3. **Modified Dismissal Hours**: Recommend early morning shift dismissals by 12:30 PM to avoid student transit during peak solar radiance (2:00 PM - 4:00 PM).
4. **First-Aid Preparedness**: Ensure school medical stations are stocked with oral rehydration salts (ORS), ice packs, and fan-assisted recovery bays.`;
  }

  if (lowerMsg.includes('energy') || lowerMsg.includes('power') || lowerMsg.includes('grid')) {
    return `### HeatShield Advisory: Power Grid & Cooling Optimization for ${city}
1. **Pre-Cooling Protocol**: Cool municipal and commercial buildings between 7:00 AM - 10:00 AM before peak grid tariff hours.
2. **Thermostat Standardization**: Set municipal and commercial AC units to 26°C (79°F), which reduces regional grid load by 14-18%.
3. **Staggered Industrial Operations**: Shift heavy energy-consuming industrial equipment to nocturnal cycles (after 9:00 PM).
4. **Substation Monitoring**: Deploy cooling fans and thermal imaging at transmission sub-stations in dense heat zones to prevent transformer explosions.`;
  }

  if (lowerMsg.includes('action') || lowerMsg.includes('priority') || lowerMsg.includes('what should')) {
    return `### HeatShield Action Plan: Urgent Heat Mitigation for ${city} (${temp}°C)
1. **Deploy Emergency Misting & Water Hubs**: Target high-density pedestrian hubs and open markets immediately.
2. **Public Cooling Centers**: Open air-conditioned public halls, libraries, and subway stations as designated public respite centers.
3. **Labor Safety Mandates**: Enforce mandatory 15-minute shaded rest breaks every hour for construction and municipal sanitation workers.
4. **Urban Heat Island Interventions**: In high-temperature zones, deploy water-sprinkler trucks on dark asphalt roads to drop ambient radiated heat by 2-3°C.`;
  }

  return `### HeatShield Urban Heat Intelligence for ${city}
- **Current Assessment**: With temperatures at ${temp}°C and risk classified as **${risk}**, immediate protective measures are required.
- **Priority Areas**: Dense urban centers, paved commercial districts, and industrial zones with low vegetative cover.
- **Key Directive**: Restrict direct sun exposure during peak hours (12:00 PM - 4:30 PM), ensure widespread access to clean drinking water, and activate community health outreach for elderly and vulnerable residents.`;
}

function generateFallbackAudit(cityData: any): string {
  const name = cityData?.name || 'Urban Zone';
  const temp = cityData?.temperature || 42;
  const humidity = cityData?.humidity || 35;
  const heatIndex = cityData?.heatIndex || 49;
  const risk = cityData?.riskLevel || 'CRITICAL';
  const score = cityData?.riskScore || 88;

  return `### Comprehensive Urban Heat Resilience Audit: ${name}

#### 1. Executive Risk Summary
- **Thermal Stress Level**: ${risk} (AI Heat Risk Score: **${score}/100**)
- **Ground-Level 2m Ambient**: **${temp}°C** | **Relative Humidity**: **${humidity}%**
- **Calculated Heat Index (Feels Like)**: **${heatIndex}°C**
- **Vulnerability Assessment**: High heat danger profile for outdoor laborers, transit commuters, and dense non-vegetated neighborhoods.

#### 2. Microclimate Hotspots & Vulnerable Neighborhoods
- **Industrial & Commercial Districts**: Concentrated asphalt and generator emissions driving surface temperatures 8–12°C higher than ambient air.
- **Historic Bazaar Corridors**: Severe thermal mass entrapment with narrow ventilation corridors. Immediate deployment of high-pressure mist cannons and shade awnings recommended.

#### 3. Energy Grid Stress & Transformer Overload Risks
- **Substation Load Warning**: Peak electrical cooling demand anticipated between 1:30 PM – 5:00 PM.
- **Municipal Directive**: Mandate commercial thermostats set to **26°C** to suppress peak kW draw by 15–20% and avoid cascading distribution transformer trip-outs.

#### 4. Immediate Life-Saving Interventions (Hour 0 to Hour 6)
- **Cooling Shelters**: Activate air-conditioned civic centers and public libraries with emergency power.
- **Hydration Depots**: Position mobile water bowsers with Oral Rehydration Salts (ORS) at central transit terminals.
- **Outdoor Labor Curfew**: Enforce a mandatory cessation of heavy physical construction between 11:00 AM and 4:30 PM.

#### 5. Mid-to-Long Term Urban Cooling Roadmap
- **High-Albedo Cool Roofs**: Subsidize reflective white elastomer coatings on industrial and school rooftops.
- **Urban Forest Corridors**: Implement targeted green buffer zones along major traffic arteries to lower surrounding radiant temperatures by up to 3.5°C.`;
}

// 1. Chat endpoint for AI Advisor
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      const fallbackReply = generateFallbackAdvice(message, context);
      return res.json({
        reply: fallbackReply,
        source: 'HeatShield Intelligence Engine',
        isAiConfigured: false,
      });
    }

    const cityContext = context ? `
[CURRENT SENSOR TELEMETRY & MICROCLIMATE DATA]
- Target City: ${context.cityName || 'Selected City'} (${context.country || 'Pakistan'})
- 2m Ground-Level Ambient Temperature: ${context.temperature}°C
- Relative Humidity: ${context.humidity}%
- Calculated Heat Index (Feels Like): ${context.heatIndex}°C
- AI Heat Risk Score: ${context.riskScore}/100
- AI Risk Classification: ${context.riskLevel}
- Thermal Dynamic Trend: ${context.trend || 'Rising'}
- High-Risk Microclimate Hotspots: ${Array.isArray(context.topZones) ? context.topZones.join(', ') : context.topZones || 'Central Commercial & Industrial Zones'}
- 24-Hour Forecast Peak: ${context.peakForecast || '44°C'}
` : '';

    let formattedPrompt = `${cityContext}\n\nUser Question: ${message}`;
    
    // Append brief recent history if available
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-4).map((h: any) => `${h.sender === 'user' ? 'User' : 'Advisor'}: ${h.text}`).join('\n');
      formattedPrompt = `Recent Conversation Context:\n${recentHistory}\n\n${formattedPrompt}`;
    }

    const result = await generateWithGemini(formattedPrompt);

    return res.json({
      reply: result.text,
      source: result.modelUsed,
      isAiConfigured: true,
    });
  } catch (error: any) {
    console.error('Gemini Chat Fallback Activated:', error?.message || error);
    const fallbackText = generateFallbackAdvice(req.body.message || '', req.body.context || {});
    return res.status(200).json({
      reply: fallbackText,
      source: 'HeatShield Intelligence Engine',
      isAiConfigured: true,
      error: error.message,
    });
  }
});

// 2. City Deep Analysis endpoint
app.post('/api/gemini/analyze-city', async (req, res) => {
  try {
    const { cityData } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      const fallbackAudit = generateFallbackAudit(cityData);
      return res.json({
        analysis: fallbackAudit,
        isAiConfigured: false,
        source: 'HeatShield Intelligence Engine',
      });
    }

    const prompt = `Perform a comprehensive Urban Heat Resilience Audit and municipal mitigation plan for the city of ${cityData.name} based on this real-time microclimate telemetry:
- Ambient Temperature (2m AGL): ${cityData.temperature}°C
- Relative Humidity: ${cityData.humidity}%
- Heat Index: ${cityData.heatIndex}°C
- AI Risk Classification: ${cityData.riskLevel} (${cityData.riskScore}/100)
- Hotspot Microclimate Zones: ${cityData.zones?.map((z: any) => `${z.name} (${z.temp}°C - ${z.risk || z.riskLevel})`).join('; ') || 'Dense Commercial, Industrial, Residential sectors'}

Provide a well-structured audit containing:
1. Executive Risk Summary
2. Microclimate Hotspots & Vulnerable Neighborhoods
3. Energy Grid Stress & Transformer Overload Risks
4. Immediate Life-Saving Interventions (Hour 0 to Hour 6)
5. Mid-to-Long Term Urban Cooling Strategies (Albedo, Green Canopies, Cool Pavements)`;

    const result = await generateWithGemini(prompt, HEATSHIELD_SYSTEM_INSTRUCTION);

    return res.json({
      analysis: result.text,
      isAiConfigured: true,
      source: result.modelUsed,
    });
  } catch (error: any) {
    console.error('Gemini City Analysis Fallback Activated:', error?.message || error);
    const fallbackAudit = generateFallbackAudit(req.body.cityData || {});
    return res.json({
      analysis: fallbackAudit,
      isAiConfigured: true,
      source: 'HeatShield Intelligence Engine',
      error: error.message,
    });
  }
});

// Heat index calculation helper
function computeHeatIndex(tempC: number, rh: number): number {
  if (tempC < 27) return Math.round(tempC * 10) / 10;
  const T = (tempC * 9) / 5 + 32;
  const R = rh;
  const c1 = -42.379;
  const c2 = 2.04901523;
  const c3 = 10.14333127;
  const c4 = -0.22475541;
  const c5 = -0.00683783;
  const c6 = -0.05481717;
  const c7 = 0.00122874;
  const c8 = 0.00085282;
  const c9 = -0.00000199;

  let hiF =
    c1 +
    c2 * T +
    c3 * R +
    c4 * T * R +
    c5 * T * T +
    c6 * R * R +
    c7 * T * T * R +
    c8 * T * R * R +
    c9 * T * T * R * R;

  const hiC = ((hiF - 32) * 5) / 9;
  return Math.round(hiC * 10) / 10;
}

function generateFallbackCustomRisk(input: any) {
  const tempC = Number(input.temperature) || 40;
  const rh = Number(input.humidity) || 40;
  const location = input.location || 'Urban Zone';
  const hi = computeHeatIndex(tempC, rh);

  let riskScore = 50;
  if (hi >= 54) riskScore = 95;
  else if (hi >= 46) riskScore = 85;
  else if (hi >= 39) riskScore = 70;
  else if (hi >= 32) riskScore = 55;
  else riskScore = 35;

  if (input.exposure === 'direct_sun') riskScore = Math.min(100, riskScore + 10);
  if (input.activityLevel === 'heavy_labor' || input.activityLevel === 'athletics') riskScore = Math.min(100, riskScore + 12);
  if (Array.isArray(input.vulnerableGroups) && input.vulnerableGroups.length > 0) riskScore = Math.min(100, riskScore + 8);

  let riskLevel = 'MODERATE';
  if (riskScore >= 85) riskLevel = 'EXTREME';
  else if (riskScore >= 70) riskLevel = 'VERY HIGH';
  else if (riskScore >= 55) riskLevel = 'HIGH';
  else if (riskScore >= 40) riskLevel = 'MODERATE';
  else riskLevel = 'LOW';

  const extremeAlerts: any[] = [];
  if (riskScore >= 80) {
    extremeAlerts.push({
      id: 'alert-stroke',
      severity: 'CRITICAL',
      title: 'Imminent Heat Stroke Danger',
      description: `At calculated Heat Index of ${hi}°C with ${input.exposure || 'direct'} exposure, continuous physical exertion leads to rapid hyperthermia and metabolic heat accumulation.`,
      urgencyAction: 'Immediate cessation of outdoor work and relocation to air-conditioned facilities.'
    });
    extremeAlerts.push({
      id: 'alert-dehydration',
      severity: 'CRITICAL',
      title: 'Accelerated Dehydration Hazard',
      description: 'Sweat rate exceeds 1.2 Liters per hour. High risk of electrolyte depletion and hypovolemic heat exhaustion.',
      urgencyAction: 'Mandate 250ml water with ORS/electrolytes every 15-20 minutes.'
    });
  } else if (riskScore >= 60) {
    extremeAlerts.push({
      id: 'alert-exhaustion',
      severity: 'WARNING',
      title: 'Severe Heat Exhaustion Warning',
      description: `Thermal stress in ${location} is high. Prolonged exposure causes dizziness, nausea, and reduced cognitive reaction time.`,
      urgencyAction: 'Enforce 15-minute shaded rest breaks every 45 minutes.'
    });
  } else {
    extremeAlerts.push({
      id: 'alert-advisory',
      severity: 'ADVISORY',
      title: 'Elevated Ambient Heat Advisory',
      description: `Moderate thermal burden observed for ${location}. Vulnerable demographics should stay hydrated and avoid peak midday solar exposure.`,
      urgencyAction: 'Maintain regular hydration and stay in well-ventilated areas.'
    });
  }

  return {
    heatIndex: hi,
    riskScore,
    riskLevel,
    extremeAlerts,
    safeExposureLimit: riskScore >= 85 ? '15 - 20 minutes maximum' : riskScore >= 70 ? '30 - 45 minutes' : '60 - 90 minutes with shade',
    hydrationRequirement: riskScore >= 80 ? '1.0 - 1.2 Liters/hour with ORS electrolyte replenishment' : '600 - 800 ml/hour with water & electrolytes',
    recommendations: [
      {
        category: 'Immediate Safety',
        title: 'Thermal Exposure Control',
        action: `Restrict outdoor exposure in ${location}, especially between 11:30 AM and 4:30 PM. Move all critical operations to shaded or cooled environments.`,
        urgency: riskScore >= 80 ? 'Critical' : 'High'
      },
      {
        category: 'Hydration & Health',
        title: 'Electrolyte & Fluid Replacement Protocol',
        action: 'Drink chilled water with oral rehydration salts (ORS). Avoid caffeinated, high-sugar, or alcoholic beverages which accelerate dehydration.',
        urgency: riskScore >= 80 ? 'Critical' : 'High'
      },
      {
        category: 'Activity & Work',
        title: 'Work-Rest Cycle Modification',
        action: 'Implement mandatory 20-minute rest breaks inside shaded or air-conditioned rest zones for every 40 minutes of activity.',
        urgency: riskScore >= 70 ? 'High' : 'Medium'
      },
      {
        category: 'Vulnerable Protection',
        title: 'High-Risk Group Safeguards',
        action: 'Ensure active monitoring for elderly individuals, young children, and individuals with cardiovascular conditions. Never leave anyone in stationary vehicles.',
        urgency: 'Critical'
      }
    ],
    detailedAnalysis: `### Thermal Physiological Risk Analysis: ${location}\n\nUnder ambient conditions of **${tempC}°C** and **${rh}% relative humidity**, the calculated perceived Heat Index is **${hi}°C**.\n\n- **Microclimate & Exposure**: With exposure condition classified as *${input.exposure || 'direct sun'}* and activity level *${input.activityLevel || 'work'}*, the human body's evaporative cooling efficiency is severely constrained.\n- **Physiological Burden**: Core body temperature will rise rapidly under sustained activity. Blood flow is diverted to the skin for convective cooling, creating cardiovascular strain.\n- **Critical Action Directive**: Immediate adherence to the recommended hydration protocols and work-rest cycles is mandatory to prevent exertional heat stroke.`,
    source: 'HeatShield Intelligence Engine',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isAiConfigured: false
  };
}

// 3. Custom Scenario Risk Assessment endpoint
app.post('/api/gemini/analyze-custom-risk', async (req, res) => {
  try {
    const input = req.body;
    const tempC = Number(input.temperature) || 40;
    const rh = Number(input.humidity) || 40;
    const location = input.location || 'Custom Location';
    const exposure = input.exposure || 'direct_sun';
    const activity = input.activityLevel || 'moderate_work';
    const vulnerable = Array.isArray(input.vulnerableGroups) ? input.vulnerableGroups.join(', ') : 'General Population';
    const envType = input.environmentType || 'dense_urban';
    const duration = input.durationHours || 2;

    const computedHi = computeHeatIndex(tempC, rh);

    if (!process.env.GEMINI_API_KEY) {
      const fallback = generateFallbackCustomRisk(input);
      return res.json(fallback);
    }

    const prompt = `You are the HeatShield AI Climate & Thermal Safety Intelligence Engine.
Analyze the following custom human heat risk scenario and return ONLY a valid JSON object (no markdown surrounding, no explanation outside JSON).

[SCENARIO INPUTS]
- Location: ${location}
- Ambient Temperature (2m): ${tempC}°C
- Relative Humidity: ${rh}%
- Calculated Mathematical Heat Index: ${computedHi}°C
- Solar / Environmental Exposure: ${exposure} (Options: direct_sun, shaded, indoor_uncooled, indoor_ac, vehicle, high_asphalt)
- Physical Activity Level: ${activity} (Options: sedentary, light_walking, moderate_work, heavy_labor, athletics)
- Vulnerable Demographics Present: ${vulnerable}
- Urban / Environmental Setting: ${envType} (Options: dense_urban, industrial, suburban, rural_field, coastal)
- Exposure Duration: ${duration} hours

[REQUIRED JSON SCHEMA]
{
  "heatIndex": number,
  "riskScore": number (0 to 100),
  "riskLevel": "LOW" | "MODERATE" | "HIGH" | "VERY HIGH" | "EXTREME",
  "extremeAlerts": [
    {
      "id": string,
      "severity": "CRITICAL" | "WARNING" | "ADVISORY",
      "title": string,
      "description": string,
      "urgencyAction": string
    }
  ],
  "safeExposureLimit": string (e.g. "20 minutes before mandatory cooldown"),
  "hydrationRequirement": string (e.g. "1.0 L/hour with ORS electrolytes"),
  "recommendations": [
    {
      "category": "Immediate Safety" | "Activity & Work" | "Hydration & Health" | "Vulnerable Protection" | "Environment",
      "title": string,
      "action": string,
      "urgency": "Critical" | "High" | "Medium"
    }
  ],
  "detailedAnalysis": string (a comprehensive markdown summary explaining thermal stress physiological mechanisms, microclimate factors, and priority safeguards)
}`;

    const result = await generateWithGemini(prompt, HEATSHIELD_SYSTEM_INSTRUCTION);
    
    // Parse JSON safely from result.text
    let parsedData: any = null;
    try {
      let cleanJson = result.text.trim();
      // Remove any markdown code wrappers
      cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      
      // If there is still surrounding text, find the outermost JSON braces
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }

      parsedData = JSON.parse(cleanJson);

      // If detailedAnalysis was stringified JSON, unpack or format it
      if (typeof parsedData.detailedAnalysis === 'string' && parsedData.detailedAnalysis.trim().startsWith('{')) {
        try {
          const innerParsed = JSON.parse(parsedData.detailedAnalysis);
          if (innerParsed.detailedAnalysis) {
            parsedData.detailedAnalysis = innerParsed.detailedAnalysis;
          }
          if (innerParsed.recommendations && (!parsedData.recommendations || parsedData.recommendations.length === 0)) {
            parsedData.recommendations = innerParsed.recommendations;
          }
          if (innerParsed.extremeAlerts && (!parsedData.extremeAlerts || parsedData.extremeAlerts.length === 0)) {
            parsedData.extremeAlerts = innerParsed.extremeAlerts;
          }
        } catch {
          // Keep as string
        }
      }
    } catch (parseErr) {
      console.warn('Could not parse Gemini JSON response, extracting fallback structure...', parseErr);
      const fallback = generateFallbackCustomRisk(input);
      fallback.detailedAnalysis = result.text;
      fallback.source = result.modelUsed;
      fallback.isAiConfigured = true;
      return res.json(fallback);
    }

    // Ensure all required fields exist
    parsedData.heatIndex = parsedData.heatIndex || computedHi;
    parsedData.source = result.modelUsed;
    parsedData.timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    parsedData.isAiConfigured = true;

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini Custom Risk Fallback Activated:', error?.message || error);
    const fallback = generateFallbackCustomRisk(req.body || {});
    return res.json({
      ...fallback,
      isAiConfigured: true,
      error: error.message,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'HeatShield AI Core Server',
    version: '1.0.0',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Vite middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // Redirect root / to /HeatShieldAI/ for consistent base routing in dev if needed
    app.get('/', (req, res, next) => {
      res.redirect('/HeatShieldAI/');
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use('/HeatShieldAI', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HeatShield AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

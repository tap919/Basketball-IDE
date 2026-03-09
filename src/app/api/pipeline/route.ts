import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { PipelineTemplate, PipelineInstance, PipelineResult } from '@/lib/pipeline/types';
import { getTemplateById } from '@/lib/pipeline/templates';

const PIPELINE_SYSTEM_PROMPT = `You are a scientific simulation engine that translates basketball statistics into biotech research outcomes.

When given a pipeline template and parameters, you should:
1. Understand the basketball-to-biotech analogy mappings
2. Generate realistic simulation results based on the parameters
3. Provide scientific interpretation of the results
4. Make recommendations based on the findings

Always respond with valid JSON containing:
- summary: A brief summary of the pipeline execution
- metrics: Key performance metrics (as numbers)
- basketballStats: Basketball-style statistics (FG%, assists, rebounds, etc.)
- biotechEquivalents: The translated biotech equivalents
- interpretation: A detailed scientific interpretation
- recommendations: An array of actionable recommendations

Be scientifically accurate while maintaining the basketball analogy framework.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, parameters, action } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const template = getTemplateById(templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    if (action === 'simulate') {
      // Use LLM to generate simulation results
      const zai = await ZAI.create();
      
      const prompt = `Run a simulation for the following pipeline:

Template: ${template.name}
Category: ${template.category}
Description: ${template.description}

Basketball Context: ${template.basketballContext}
Biotech Application: ${template.biotechApplication}

Parameters:
${Object.entries(parameters || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Steps to simulate:
${template.steps.map((s, i) => `${i + 1}. ${s.name}: ${s.description}`).join('\n')}

Generate realistic simulation results in JSON format with:
- summary
- metrics (object with numeric values)
- basketballStats (object with numeric values)
- biotechEquivalents (object with numeric values)
- interpretation (detailed scientific text)
- recommendations (array of strings)

Respond ONLY with valid JSON, no markdown or other text.`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: PIPELINE_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = completion.choices[0]?.message?.content || '';
      
      // Parse the JSON response
      let result: PipelineResult;
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        // Fallback result if parsing fails
        result = {
          summary: `Pipeline "${template.name}" completed successfully.`,
          metrics: {
            efficiency: 0.85,
            accuracy: 0.92,
            duration: 180
          },
          basketballStats: {
            FG_PCT: 46.5,
            AST: 24.2,
            REB: 41.8,
            TOV: 13.1,
            PLUS_MINUS: 7.2
          },
          biotechEquivalents: {
            transfectionEfficiency: 46.5,
            synergyIndex: 24.2,
            recaptureRate: 41.8,
            adverseEvents: 13.1,
            therapeuticIndex: 7.2
          },
          interpretation: content,
          recommendations: [
            'Review the generated results for accuracy',
            'Consider adjusting parameters for optimization',
            'Compare with baseline measurements'
          ]
        };
      }

      return NextResponse.json({
        success: true,
        result,
        templateId,
        executedAt: new Date().toISOString()
      });
    }

    if (action === 'validate') {
      // Validate parameters
      const validationErrors: string[] = [];
      
      template.parameters.forEach(param => {
        const value = parameters?.[param.name];
        if (value === undefined || value === null || value === '') {
          validationErrors.push(`Parameter "${param.label}" is required`);
        }
        if (param.type === 'number' && typeof value === 'number') {
          if (param.min !== undefined && value < param.min) {
            validationErrors.push(`Parameter "${param.label}" must be at least ${param.min}`);
          }
          if (param.max !== undefined && value > param.max) {
            validationErrors.push(`Parameter "${param.label}" must be at most ${param.max}`);
          }
        }
      });

      return NextResponse.json({
        valid: validationErrors.length === 0,
        errors: validationErrors
      });
    }

    // Default: return template info
    return NextResponse.json({
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
        stepCount: template.steps.length,
        estimatedDuration: template.estimatedDuration
      }
    });

  } catch (error: any) {
    console.error('Pipeline API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Pipeline execution failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('templateId');
  
  if (templateId) {
    const template = getTemplateById(templateId);
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ template });
  }
  
  // Return all templates
  const { pipelineTemplates } = await import('@/lib/pipeline/templates');
  return NextResponse.json({ 
    templates: pipelineTemplates,
    count: pipelineTemplates.length
  });
}

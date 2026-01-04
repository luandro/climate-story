import rawStoryData from './story-data.json';
import { z } from 'zod';

const SourceSchema = z.object({
  name: z.string(),
  ref: z.string(),
  type: z.enum(['government', 'intergovernmental', 'ngo', 'academic', 'media']),
  trust_level: z.enum(['very_high', 'high', 'medium', 'unknown']),
  url: z.string().nullable(),
});

const MetricValueSchema = z.object({
  number: z.number(),
  unit: z.string(),
  precision: z.number().optional(),
});

const MetricBaseSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    geography: z.enum(['global', 'Brazil', 'region']),
    type: z.enum(['current_state', 'trend', 'projection', 'target']),
    year_reference: z.number(),
    sources: z.array(z.string()).min(1),
  })
  .passthrough();

const MetricSchema = MetricBaseSchema.extend({
  value: MetricValueSchema.optional(),
  impact: MetricValueSchema.optional(),
  target_range: z
    .object({
      min: MetricValueSchema,
      max: MetricValueSchema,
    })
    .optional(),
});

const MetricsGroupSchema = z.object({
  title: z.string(),
  chart_type_suggestion: z.string(),
  items: z.array(z.string()),
});

const NarrativeChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  guiding_question: z.string(),
  goal: z.string(),
  primary_metrics: z.array(z.string()),
  visuals: z.array(z.object({ type: z.string(), description: z.string() }).passthrough()),
  copy: z.array(z.string()),
  interaction: z.object({ scroll_behavior: z.string(), micro_interaction: z.string() }),
});

const StoryDataSchema = z.object({
  meta: z.object({
    schema_version: z.string(),
    last_updated: z.string(),
    intended_use: z.array(z.string()),
    localization: z.object({
      default_language: z.string(),
      supported_languages: z.array(z.string()),
    }),
  }),
  sources: z.record(SourceSchema),
  metrics_registry: z.record(MetricSchema),
  metrics: z.record(MetricsGroupSchema),
  narrative: z.object({
    title: z.string(),
    chapters: z.array(NarrativeChapterSchema),
  }),
  app_structure: z
    .object({
      menu: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          purpose: z.string(),
          anchors: z.array(z.string()),
        })
      ),
      routing: z.object({
        keep_routes: z.boolean(),
        chapter_routes: z.array(z.string()),
        deep_links: z.boolean(),
      }),
    })
    .optional(),
  data_quality: z
    .object({
      status_summary: z.record(z.array(z.string())),
      update_workflow_hint: z.object({
        goal: z.string(),
        recommended_steps: z.array(z.string()),
      }),
    })
    .optional(),
});

export type StoryData = z.infer<typeof StoryDataSchema>;

function assertStoryData(data: StoryData) {
  const registry = data.metrics_registry;

  for (const [key, metric] of Object.entries(registry)) {
    if (key !== metric.id) {
      throw new Error(`Metric registry key mismatch: ${key} !== ${metric.id}`);
    }
  }

  for (const [groupId, group] of Object.entries(data.metrics)) {
    for (const metricId of group.items) {
      if (!registry[metricId]) {
        throw new Error(`Missing metric '${metricId}' referenced in group '${groupId}'.`);
      }
    }
  }

  for (const chapter of data.narrative.chapters) {
    for (const metricId of chapter.primary_metrics) {
      if (!registry[metricId]) {
        throw new Error(`Missing metric '${metricId}' referenced in chapter '${chapter.id}'.`);
      }
    }
  }

  for (const metric of Object.values(registry)) {
    for (const sourceId of metric.sources) {
      if (!data.sources[sourceId]) {
        throw new Error(`Missing source '${sourceId}' referenced by metric '${metric.id}'.`);
      }
    }
  }
}

export const storyData: StoryData = (() => {
  const parsed = StoryDataSchema.parse(rawStoryData);
  assertStoryData(parsed);
  return parsed;
})();

export function resolveMetric(metricId: string) {
  return storyData.metrics_registry[metricId];
}

export function resolveGroupItems(groupId: string) {
  const group = storyData.metrics[groupId];
  if (!group) return [];
  return group.items.map((metricId) => storyData.metrics_registry[metricId]);
}

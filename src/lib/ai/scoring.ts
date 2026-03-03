/**
 * Calculates the weighted overall score from three dimension scores.
 *
 * Formula: overall = (clarity × 0.25) + (structure × 0.30) + (depth × 0.45)
 *
 * This is enforced in code to guarantee correctness regardless of
 * what the AI model returns for overall_score.
 */
export function calculateOverallScore(
  clarityScore: number,
  structureScore: number,
  depthScore: number
): number {
  const raw =
    clarityScore * 0.25 + structureScore * 0.3 + depthScore * 0.45;
  return Math.round(raw * 10) / 10;
}

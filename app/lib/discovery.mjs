// CARLi Taste Build09: cultural candidates are NOT pet-friendly recommendations.
export function buildDiscoveryView(discovery, {limit=8}={}) {
  const evidence = Array.isArray(discovery?.evidence) ? discovery.evidence : [];
  const seen = new Set();
  const candidates = [];
  for (const item of evidence) {
    if (!item || typeof item.id !== 'string' || typeof item.name !== 'string') continue;
    if (!item.id.trim() || !item.name.trim() || seen.has(item.id)) continue;
    seen.add(item.id);
    candidates.push({
      id: item.id,
      name: item.name,
      category: typeof item.category === 'string' ? item.category : 'unknown',
      culturalSource: 'Qloo',
      culturalEvidenceId: item.id,
      petPolicy: 'UNVERIFIED',
      actionable: false,
      requiresIndependentVerification: true
    });
    if (candidates.length >= limit) break;
  }
  return {
    status: candidates.length ? 'CULTURAL_CANDIDATES_UNVERIFIED' : 'NO_CULTURAL_CANDIDATES',
    candidates,
    recommendations: [],
    ablation: {
      qlooOn: {culturalCandidates: candidates.length},
      qlooOff: {culturalCandidates: 0},
      deltaCulturalCandidates: candidates.length,
      note: 'Structural ON/OFF comparison only; not proof of recommendation quality.'
    },
    notice: 'Qloo supplies cultural affinity signals, not pet-friendly venue verification. No venue is approved for a pet visit.'
  };
}

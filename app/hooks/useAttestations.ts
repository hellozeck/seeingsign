'use client';

import { useState, useEffect } from 'react';
import { attestationService } from '../services/attestation';

export interface Attestation {
  id: string;
  data: {
    Country: string;
    City: string[];
  };
  attester: string;
  timestamp: number;
  indexingValue: string;
}

export function useAttestations(schemaId?: string) {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttestations() {
      if (!schemaId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await attestationService.queryAttestations(schemaId);

        if (result.success) {
          console.log('Fetched attestations:', result.attestations);
          setAttestations(result.attestations);
        } else {
          setError(result.error || 'Failed to fetch attestations');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAttestations();
  }, [schemaId]);

  return {
    attestations,
    loading,
    error,
  };
}
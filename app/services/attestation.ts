import { IndexService } from "@ethsign/sp-sdk";

export interface AttestationListResponse {
  id: string;
  mode: string;
  chainType: string;
  chainId: string;
  attestationId: string;
  schemaId: string;
  attester: string;
  attestTimestamp: number;
  recipients: string[];
}

export interface AttestationDetailResponse {
  id: string;
  indexingValue: string;
  data: string;
  attestTimestamp: number;
  attester: string;
}

export class AttestationService {
  private baseUrl = 'https://scan.sign.global/api';

  async queryAttestations(schemaId: string, page: number = 1) {
    try {
      const response = await fetch(
        `${this.baseUrl}/scan/attestations?schemaId=${schemaId}&page=${page}`
      );
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch attestations');
      }

      // 获取每个 attestation 的详细信息
      const detailPromises = data.data.rows.map((row: AttestationListResponse) =>
        this.getAttestationDetail(row.id)
      );

      const details = await Promise.all(detailPromises);
      
      return {
        success: true,
        attestations: details.filter(detail => detail !== null),
        total: data.data.total
      };
    } catch (error) {
      console.error("Failed to query attestations:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        attestations: [],
        total: 0
      };
    }
  }

  private async getAttestationDetail(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/scan/attestations/${id}`);
      const data = await response.json();
      
      if (!data.success) {
        return null;
      }

      const indexValue = data.data.indexingValue.split('-');
      return {
        id: data.data.id,
        data: {
          Country: indexValue[0],
          City: [indexValue[1]]
        },
        attester: data.data.attester,
        timestamp: data.data.attestTimestamp,
        indexingValue: data.data.indexingValue
      };
    } catch (error) {
      console.error(`Failed to fetch attestation detail for ${id}:`, error);
      return null;
    }
  }
}

export const attestationService = new AttestationService();
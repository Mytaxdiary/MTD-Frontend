import apiClient from '@/lib/api/axiosClient';

export interface HmrcStatus {
  connected: boolean;
  status?: 'connected' | 'disconnected' | 'expired';
  connectedAt?: string;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string | null;
  scope?: string | null;
  arn?: string | null;
}

export const hmrcService = {
  /** Get the HMRC OAuth authorize URL from the backend. */
  async getConnectUrl(): Promise<string> {
    const res = await apiClient.get<{ data: { authUrl: string } }>('/hmrc/connect');
    return res.data.data.authUrl;
  },

  /** Send the HMRC authorization code to backend to exchange for tokens. */
  async exchangeCode(code: string): Promise<void> {
    await apiClient.post('/hmrc/callback', { code });
  },

  /** Fetch current HMRC connection status for this firm. */
  async getStatus(): Promise<HmrcStatus> {
    const res = await apiClient.get<{ data: HmrcStatus }>('/hmrc/status');
    return res.data.data;
  },

  /** Save or update the Agent Reference Number for this firm. */
  async updateArn(arn: string): Promise<{ arn: string }> {
    const res = await apiClient.patch<{ data: { arn: string } }>('/hmrc/arn', { arn });
    return res.data.data;
  },

  /** Disconnect HMRC — removes stored tokens for this firm. */
  async disconnect(): Promise<void> {
    await apiClient.delete('/hmrc/disconnect');
  },
};

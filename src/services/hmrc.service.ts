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

export interface HmrcSandboxAgentUser {
  userId: string;
  password: string;
  userFullName: string;
  emailAddress: string;
  groupIdentifier: string;
  agentServicesAccountNumber: string;
  agentCode: string;
}

export interface HmrcSandboxIndividualAddress {
  line1?: string;
  line2?: string;
  postcode?: string;
}

export interface HmrcSandboxIndividualDetails {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: HmrcSandboxIndividualAddress;
}

export interface HmrcSandboxIndividualUser {
  userId: string;
  password: string;
  userFullName: string;
  emailAddress: string;
  groupIdentifier?: string;
  nino: string;
  mtdItId?: string;
  postcode: string;
  individualDetails?: HmrcSandboxIndividualDetails;
}

export interface SandboxTestUsersResult {
  agent: HmrcSandboxAgentUser;
  individual: HmrcSandboxIndividualUser;
  nextSteps: string[];
}

export interface FraudHeaderValidationResult {
  valid: boolean;
  hasWarnings?: boolean;
  warningHeaders?: string[];
  code?: string;
  message?: string;
  specVersion?: string;
  headers?: Array<{
    header: string;
    value?: string;
    code?: string;
    errors?: unknown[];
  }>;
  errors?: unknown[];
  warnings?: unknown[];
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

  /** Manually refresh the HMRC access token using the stored refresh token. */
  async refreshToken(): Promise<{
    status: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string | null;
    scope: string | null;
  }> {
    const res = await apiClient.post<{
      data: {
        status: string;
        accessTokenExpiresAt: string;
        refreshTokenExpiresAt: string | null;
        scope: string | null;
      };
    }>('/hmrc/refresh-token');
    return res.data.data;
  },

  /** HMRC sandbox — create agent + individual test users. */
  async createSandboxTestUsers(): Promise<SandboxTestUsersResult> {
    const res = await apiClient.post<{ data: SandboxTestUsersResult }>('/hmrc/sandbox/test-users');
    return res.data.data;
  },

  /** Validate Gov-* fraud prevention headers with HMRC test API. */
  async validateFraudHeaders(): Promise<FraudHeaderValidationResult> {
    const res = await apiClient.get<{ data: FraudHeaderValidationResult }>(
      '/hmrc/validate-fraud-headers',
    );
    return res.data.data;
  },
};

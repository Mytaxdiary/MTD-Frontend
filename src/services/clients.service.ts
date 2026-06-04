import apiClient from '@/lib/api/axiosClient'

export interface ClientRecord {
  id: string
  tenantId: string
  name: string
  nino: string
  postcode: string
  email: string
  phone?: string
  agentType: string
  invitationId?: string
  /** HMRC invitation status (open string — API may return values beyond the common set). */
  invitationStatus: string
  invitationSentAt?: string
  invitationExpiresAt?: string
  authorisedAt?: string
  createdAt: string
}

export interface CreateClientPayload {
  name: string
  nino: string
  postcode: string
  email: string
  phone?: string
  agentType?: string
  personalMessage?: string
}

export interface CreateClientResult {
  client: ClientRecord
  invitationSent: boolean
  warning?: string
}

export interface ItsaStatusDetail {
  submittedOn?: string
  status?: string
  statusReason?: string
  businessIncome2YearsPrior?: number
}

export interface ItsaStatusYear {
  taxYear: string
  itsaStatusDetails?: ItsaStatusDetail[]
}

export interface ItsaStatusResponse {
  itsaStatuses?: ItsaStatusYear[]
}

export interface BusinessListItem {
  typeOfBusiness: string
  businessId: string
  tradingName?: string
}

export interface BusinessListResponse {
  listOfBusinesses: BusinessListItem[]
}

export interface BusinessAccountingPeriod {
  start?: string
  end?: string
}

export interface BusinessQuarterlyTypeChoice {
  quarterlyPeriodType?: string
  taxYearOfChoice?: string
}

export interface BusinessDetailsResponse {
  businessId: string
  typeOfBusiness: string
  tradingName?: string
  yearOfMigration?: string
  firstAccountingPeriodStartDate?: string
  firstAccountingPeriodEndDate?: string
  accountingPeriods?: BusinessAccountingPeriod[]
  quarterlyTypeChoice?: BusinessQuarterlyTypeChoice
  commencementDate?: string
  cessationDate?: string
  businessAddressLineOne?: string
  businessAddressLineTwo?: string
  businessAddressLineThree?: string
  businessAddressLineFour?: string
  businessAddressPostcode?: string
  businessAddressCountryCode?: string
}

export interface GetItsaStatusParams {
  taxYear: string
  history?: boolean
  futureYears?: boolean
}

export const clientsService = {
  async create(payload: CreateClientPayload): Promise<CreateClientResult> {
    const res = await apiClient.post<{ data: CreateClientResult }>('/clients', payload)
    return res.data.data
  },

  async list(): Promise<ClientRecord[]> {
    const res = await apiClient.get<{ data: ClientRecord[] }>('/clients')
    return res.data.data
  },

  async getOne(id: string): Promise<ClientRecord> {
    const res = await apiClient.get<{ data: ClientRecord }>(`/clients/${id}`)
    return res.data.data
  },

  async checkInvitationStatus(id: string): Promise<ClientRecord> {
    const res = await apiClient.get<{ data: ClientRecord }>(`/clients/${id}/invitation-status`)
    return res.data.data
  },

  async checkRelationshipStatus(
    id: string,
  ): Promise<{ client: ClientRecord; relationshipActive: boolean }> {
    const res = await apiClient.get<{
      data: { client: ClientRecord; relationshipActive: boolean }
    }>(`/clients/${id}/relationship-status`)
    return res.data.data
  },

  async resendInvitation(
    id: string,
    payload?: { personalMessage?: string },
  ): Promise<CreateClientResult> {
    const res = await apiClient.post<{ data: CreateClientResult }>(
      `/clients/${id}/resend-invitation`,
      payload ?? {},
    )
    return res.data.data
  },

  async listOutstandingInvitations(): Promise<ClientRecord[]> {
    const res = await apiClient.get<{ data: ClientRecord[] }>('/clients/outstanding-invitations')
    return res.data.data
  },

  async acceptInvitationSandbox(id: string): Promise<ClientRecord> {
    const res = await apiClient.post<{ data: ClientRecord }>(
      `/clients/${id}/accept-invitation-sandbox`,
      {},
    )
    return res.data.data
  },

  async getItsaStatus(id: string, params: GetItsaStatusParams): Promise<ItsaStatusResponse> {
    const res = await apiClient.get<{ data: ItsaStatusResponse }>(`/clients/${id}/itsa-status`, {
      params,
    })
    return res.data.data
  },

  async listBusinesses(id: string): Promise<BusinessListResponse> {
    const res = await apiClient.get<{ data: BusinessListResponse }>(`/clients/${id}/businesses`)
    return res.data.data
  },

  async getBusinessDetails(id: string, businessId: string): Promise<BusinessDetailsResponse> {
    const res = await apiClient.get<{ data: BusinessDetailsResponse }>(
      `/clients/${id}/businesses/${encodeURIComponent(businessId)}`,
    )
    return res.data.data
  },
}

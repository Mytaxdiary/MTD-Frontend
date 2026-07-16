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

export interface BulkImportRowError {
  row: number
  field: string
  message: string
}

export interface BulkImportResult {
  valid: true
  created: number
  invitationsSent: number
  warnings: Array<{ row: number; name: string; message: string }>
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

export interface ObligationDetail {
  periodStartDate: string
  periodEndDate: string
  dueDate: string
  receivedDate?: string
  status: string
}

export interface BusinessObligationGroup {
  typeOfBusiness: string
  businessId: string
  obligationDetails: ObligationDetail[]
}

export interface IncomeExpenditureObligationsResponse {
  obligations: BusinessObligationGroup[]
}

export interface CrystallisationObligation {
  periodStartDate: string
  periodEndDate: string
  dueDate: string
  status: string
  receivedDate?: string
}

export interface CrystallisationObligationsResponse {
  obligations: CrystallisationObligation[]
}

export interface GetIncomeExpenditureObligationsParams {
  typeOfBusiness?: string
  businessId?: string
  fromDate?: string
  toDate?: string
  status?: string
}

export interface GetCrystallisationObligationsParams {
  taxYear?: string
  status?: string
}

export interface HmrcLatePaymentInterest {
  accruingInterestAmount?: number
  interestOutstandingAmount?: number
  interestAmount?: number
}

export interface HmrcAccountDocumentDetail {
  taxYear?: string
  documentId?: string
  documentDate?: string
  documentText?: string
  documentDueDate?: string
  documentDescription?: string
  originalAmount?: number
  outstandingAmount?: number
  creditReason?: string
  latePaymentInterest?: HmrcLatePaymentInterest
}

export interface HmrcBalanceDetails {
  payableAmount?: number
  overdueAmount?: number
  totalBalance?: number
  totalBcdBalance?: number
}

export interface BalanceAndTransactionsResponse {
  balanceDetails?: HmrcBalanceDetails
  documentDetails?: HmrcAccountDocumentDetail[]
}

export interface GetBalanceAndTransactionsParams {
  fromDate?: string
  toDate?: string
  docNumber?: string
  onlyOpenItems?: boolean
  calculateAccruedInterest?: boolean
}

export interface HmrcPayment {
  paymentLot?: string
  paymentLotItem?: string
  paymentReference?: string
  paymentAmount?: number
  paymentMethod?: string
  transactionDate?: string
}

export interface PaymentsAndAllocationsResponse {
  payments: HmrcPayment[]
}

export interface GetPaymentsAndAllocationsParams {
  fromDate?: string
  toDate?: string
  paymentLot?: string
  paymentLotItem?: string
}

export interface PaymentRecord {
  date: string
  amount: number
  ref: string
  method: string
}

export interface NoteRecord {
  id: string
  clientId: string
  text: string
  authorName: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface GetItsaStatusParams {
  taxYear: string
  history?: boolean
  futureYears?: boolean
}

export interface IncomeSummaryBusiness {
  businessId: string
  typeOfBusiness: string
  tradingName?: string
  totalIncome: number
  totalExpenses: number
  netProfit: number
  netLoss: number
}

export interface IncomeSummaryResponse {
  taxYear: string
  totalIncome: number
  totalExpenses: number
  netProfit: number
  netLoss: number
  businesses: IncomeSummaryBusiness[]
}

export const clientsService = {
  async create(payload: CreateClientPayload): Promise<CreateClientResult> {
    const res = await apiClient.post<{ data: CreateClientResult }>('/clients', payload)
    return res.data.data
  },

  async getPortalFiles(clientId: string): Promise<Array<{
    id: string; originalName: string; mimeType: string; size: number; viewedByAgent: boolean; createdAt: string
  }>> {
    const res = await apiClient.get<{ data: Array<{ id: string; originalName: string; mimeType: string; size: number; viewedByAgent: boolean; createdAt: string }> }>(`/clients/${clientId}/portal-files`)
    return res.data.data
  },

  async list(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<{ clients: ClientRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    const res = await apiClient.get<{
      data: { clients: ClientRecord[]; total: number; page: number; limit: number; totalPages: number }
    }>('/clients', { params })
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

  async getIncomeAndExpenditureObligations(
    id: string,
    params: GetIncomeExpenditureObligationsParams,
  ): Promise<IncomeExpenditureObligationsResponse> {
    const res = await apiClient.get<{ data: IncomeExpenditureObligationsResponse }>(
      `/clients/${id}/obligations/income-and-expenditure`,
      { params },
    )
    return res.data.data
  },

  async getCrystallisationObligations(
    id: string,
    params: GetCrystallisationObligationsParams,
  ): Promise<CrystallisationObligationsResponse> {
    const res = await apiClient.get<{ data: CrystallisationObligationsResponse }>(
      `/clients/${id}/obligations/crystallisation`,
      { params },
    )
    return res.data.data
  },

  async getBalanceAndTransactions(
    id: string,
    params?: GetBalanceAndTransactionsParams,
  ): Promise<BalanceAndTransactionsResponse> {
    const res = await apiClient.get<{ data: BalanceAndTransactionsResponse }>(
      `/clients/${id}/liabilities/balance-and-transactions`,
      { params },
    )
    return res.data.data
  },

  async getPaymentsAndAllocations(
    id: string,
    params?: GetPaymentsAndAllocationsParams,
  ): Promise<PaymentsAndAllocationsResponse> {
    const res = await apiClient.get<{ data: PaymentsAndAllocationsResponse }>(
      `/clients/${id}/liabilities/payments-and-allocations`,
      { params },
    )
    return res.data.data
  },

  /**
   * Aggregated BISS v3.0 income summary for all businesses.
   * Returns YTD totalIncome, totalExpenses, netProfit, netLoss.
   * Defaults to the current running UK tax year if taxYear is omitted.
   */
  async getIncomeSummary(id: string, taxYear?: string): Promise<IncomeSummaryResponse> {
    const res = await apiClient.get<{ data: IncomeSummaryResponse }>(
      `/clients/${id}/income-summary`,
      taxYear ? { params: { taxYear } } : undefined,
    )
    return res.data.data
  },

  // ── Client Notes ──────────────────────────────────────────────────────────

  async getNotes(clientId: string): Promise<NoteRecord[]> {
    const res = await apiClient.get<{ data: NoteRecord[] }>(`/clients/${clientId}/notes`)
    return res.data.data
  },

  async createNote(clientId: string, text: string): Promise<NoteRecord> {
    const res = await apiClient.post<{ data: NoteRecord }>(`/clients/${clientId}/notes`, { text })
    return res.data.data
  },

  async updateNote(clientId: string, noteId: string, patch: { text?: string; isPinned?: boolean }): Promise<NoteRecord> {
    const res = await apiClient.patch<{ data: NoteRecord }>(`/clients/${clientId}/notes/${noteId}`, patch)
    return res.data.data
  },

  async deleteNote(clientId: string, noteId: string): Promise<void> {
    await apiClient.delete(`/clients/${clientId}/notes/${noteId}`)
  },

  /** Bulk import clients from a CSV file. Returns success summary or throws with validation errors. */
  async bulkImport(file: File): Promise<BulkImportResult> {
    const form = new FormData()
    form.append('file', file)
    const res = await apiClient.post<{ data: BulkImportResult }>('/clients/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },
}

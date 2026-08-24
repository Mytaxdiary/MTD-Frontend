import apiClient from '@/lib/api/axiosClient'
import type { ManualPipelineStatus, PipelineStatus } from '@/lib/dashboard/pipelineStatus'

export interface ClientBusinessRow {
  businessId: string
  typeOfBusiness: string
  tradingName?: string
  chaseCount: number
  lastChaseAt: string | null
  lastChaseStatus: string | null
}

export interface ClientRecord {
  id: string
  tenantId: string
  name: string
  nino: string
  postcode: string
  email: string
  phone?: string
  utr?: string
  /** Short name for chase greetings (e.g. Tom). Falls back to first name when unset. */
  preferredName?: string
  agentType: string
  invitationId?: string
  /** HMRC invitation status (open string — API may return values beyond the common set). */
  invitationStatus: string
  invitationSentAt?: string
  invitationExpiresAt?: string
  authorisedAt?: string
  /** Persisted MTD pipeline status (pending-invite → … → submitted). */
  pipelineStatus?: PipelineStatus | string
  /** Staff user this client is assigned to. Null when unassigned. */
  assignedToUserId?: string | null
  createdAt: string
  /** Present on list responses — HMRC businesses with per-business chase stats */
  businesses?: ClientBusinessRow[]
}

export interface ClientStatusHistoryEntry {
  id: string
  fromStatus: string | null
  toStatus: string
  source: 'system' | 'agent'
  changedByUserId: string | null
  changedByName: string | null
  createdAt: string
}

export interface ClientStatusHistoryResponse {
  currentStatus: PipelineStatus
  nextManualStatus: ManualPipelineStatus | null
  history: ClientStatusHistoryEntry[]
}

export interface CreateClientPayload {
  name: string
  nino: string
  postcode: string
  email: string
  phone?: string
  /** 10-digit Self Assessment UTR (optional) */
  utr?: string
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

export interface HmrcPaymentAllocation {
  chargeReference?: string
  chargeDetail?: {
    documentId?: string
    chargeTypeDescription?: string
  }
}

export interface HmrcPayment {
  paymentLot?: string
  paymentLotItem?: string
  paymentReference?: string
  paymentAmount?: number
  paymentMethod?: string
  transactionDate?: string
  allocations?: HmrcPaymentAllocation[]
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

export interface HmrcChargeHistoryDetail {
  taxYear?: string
  transactionId?: string
  transactionDate?: string
  description?: string
  totalAmount?: number
  changeDate?: string
  changeTimestamp?: string
  changeReason?: string
  poaAdjustmentReason?: string
}

export interface ChargeHistoryResponse {
  chargeHistoryDetails: HmrcChargeHistoryDetail[]
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

export interface SubmittedPeriodFigure {
  label: string
  periodStartDate?: string
  periodEndDate?: string
  periodId?: string
  businessId: string
  typeOfBusiness: string
  tradingName?: string
  income: number
  expenses: number
  net: number
  cumulative?: boolean
}

export interface SeCumulativeSummaryResponse {
  taxYear: string
  businessId: string
  typeOfBusiness: string
  tradingName?: string
  source: 'hmrc' | 'sandbox-test' | 'empty'
  periodDates: { periodStartDate: string; periodEndDate: string } | null
  periodIncome: { turnover: number; other: number }
  periodExpenses: { consolidatedExpenses: number }
  submittedOn?: string
}

export interface SubmittedFiguresResponse {
  taxYear: string
  totalIncome: number
  totalExpenses: number
  netProfit: number
  netLoss: number
  periods: SubmittedPeriodFigure[]
  businesses: IncomeSummaryBusiness[]
}

export interface UkPropertyCumulativeSummaryResponse {
  taxYear: string
  businessId: string
  typeOfBusiness: string
  tradingName?: string
  source: 'hmrc' | 'sandbox-test' | 'empty'
  periodDates: { periodStartDate: string; periodEndDate: string } | null
  periodAmount: number
  consolidatedExpenses: number
  submittedOn?: string
}

export interface UkPropertyMoneyBlock {
  income?: Record<string, unknown>
  expenses?: Record<string, unknown>
  adjustments?: Record<string, unknown>
  allowances?: Record<string, unknown>
}

export interface UkPropertyAnnualSubmission {
  submittedOn?: string
  ukProperty?: UkPropertyMoneyBlock
  ukFhlProperty?: UkPropertyMoneyBlock
  ukNonFhlProperty?: UkPropertyMoneyBlock
}

export interface UkPropertyFiguresResponse {
  taxYear: string
  businessId: string
  typeOfBusiness: string
  tradingName?: string
  fromDate?: string
  toDate?: string
  submittedOn?: string
  income: number
  expenses: number
  net: number
  periods: SubmittedPeriodFigure[]
  annual: UkPropertyAnnualSubmission | null
}

export const clientsService = {
  async create(payload: CreateClientPayload): Promise<CreateClientResult> {
    const res = await apiClient.post<{ data: CreateClientResult }>('/clients', payload)
    return res.data.data
  },

  async getPortalFiles(clientId: string): Promise<
    Array<{
      id: string
      originalName: string
      mimeType: string
      size: number
      viewedByAgent: boolean
      createdAt: string
    }>
  > {
    const res = await apiClient.get<{
      data: Array<{
        id: string
        originalName: string
        mimeType: string
        size: number
        viewedByAgent: boolean
        createdAt: string
      }>
    }>(`/clients/${clientId}/portal-files`)
    return res.data.data
  },

  async list(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
    agentType?: string
  }): Promise<{
    clients: ClientRecord[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const res = await apiClient.get<{
      data: {
        clients: ClientRecord[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
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
    id: string
  ): Promise<{ client: ClientRecord; relationshipActive: boolean }> {
    const res = await apiClient.get<{
      data: { client: ClientRecord; relationshipActive: boolean }
    }>(`/clients/${id}/relationship-status`)
    return res.data.data
  },

  async resendInvitation(
    id: string,
    payload?: { personalMessage?: string }
  ): Promise<CreateClientResult> {
    const res = await apiClient.post<{ data: CreateClientResult }>(
      `/clients/${id}/resend-invitation`,
      payload ?? {}
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
      {}
    )
    return res.data.data
  },

  async updateClient(
    id: string,
    fields: { utr?: string; preferredName?: string },
  ): Promise<ClientRecord> {
    const res = await apiClient.patch<{ data: ClientRecord }>(`/clients/${id}`, fields)
    return res.data.data
  },

  async getStatusHistory(id: string): Promise<ClientStatusHistoryResponse> {
    const res = await apiClient.get<{ data: ClientStatusHistoryResponse }>(
      `/clients/${id}/status-history`,
    )
    return res.data.data
  },

  async updatePipelineStatus(
    id: string,
    status: ManualPipelineStatus,
  ): Promise<ClientStatusHistoryResponse> {
    const res = await apiClient.patch<{ data: ClientStatusHistoryResponse }>(
      `/clients/${id}/pipeline-status`,
      { status },
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
      `/clients/${id}/businesses/${encodeURIComponent(businessId)}`
    )
    return res.data.data
  },

  async getIncomeAndExpenditureObligations(
    id: string,
    params: GetIncomeExpenditureObligationsParams
  ): Promise<IncomeExpenditureObligationsResponse> {
    const res = await apiClient.get<{ data: IncomeExpenditureObligationsResponse }>(
      `/clients/${id}/obligations/income-and-expenditure`,
      { params }
    )
    return res.data.data
  },

  async getCrystallisationObligations(
    id: string,
    params: GetCrystallisationObligationsParams
  ): Promise<CrystallisationObligationsResponse> {
    const res = await apiClient.get<{ data: CrystallisationObligationsResponse }>(
      `/clients/${id}/obligations/crystallisation`,
      { params }
    )
    return res.data.data
  },

  async getBalanceAndTransactions(
    id: string,
    params?: GetBalanceAndTransactionsParams
  ): Promise<BalanceAndTransactionsResponse> {
    const res = await apiClient.get<{ data: BalanceAndTransactionsResponse }>(
      `/clients/${id}/liabilities/balance-and-transactions`,
      { params }
    )
    return res.data.data
  },

  async getPaymentsAndAllocations(
    id: string,
    params?: GetPaymentsAndAllocationsParams
  ): Promise<PaymentsAndAllocationsResponse> {
    const res = await apiClient.get<{ data: PaymentsAndAllocationsResponse }>(
      `/clients/${id}/liabilities/payments-and-allocations`,
      { params }
    )
    return res.data.data
  },

  async getChargeHistory(id: string, transactionId: string): Promise<ChargeHistoryResponse> {
    const res = await apiClient.get<{ data: ChargeHistoryResponse }>(
      `/clients/${id}/liabilities/charges/${encodeURIComponent(transactionId)}`
    )
    return res.data.data
  },

  async getChargeHistoryByTransactionId(
    id: string,
    transactionId: string
  ): Promise<ChargeHistoryResponse> {
    const res = await apiClient.get<{ data: ChargeHistoryResponse }>(
      `/clients/${id}/liabilities/charges/by-transaction/${encodeURIComponent(transactionId)}`
    )
    return res.data.data
  },

  async getChargeHistoryByChargeReference(
    id: string,
    chargeReference: string
  ): Promise<ChargeHistoryResponse> {
    const res = await apiClient.get<{ data: ChargeHistoryResponse }>(
      `/clients/${id}/liabilities/charges/by-reference/${encodeURIComponent(chargeReference)}`
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
      taxYear ? { params: { taxYear } } : undefined
    )
    return res.data.data
  },

  /** YTD (BISS) + Self-Employment / Property period or cumulative summaries. */
  async getSubmittedFigures(id: string, taxYear?: string): Promise<SubmittedFiguresResponse> {
    const res = await apiClient.get<{ data: SubmittedFiguresResponse }>(
      `/clients/${id}/submitted-figures`,
      taxYear ? { params: { taxYear } } : undefined
    )
    return res.data.data
  },

  async getUkPropertyFigures(
    id: string,
    businessId: string,
    taxYear?: string
  ): Promise<UkPropertyFiguresResponse> {
    const res = await apiClient.get<{ data: UkPropertyFiguresResponse }>(
      `/clients/${id}/businesses/${encodeURIComponent(businessId)}/property-figures`,
      taxYear ? { params: { taxYear } } : undefined
    )
    return res.data.data
  },

  async getSeCumulative(
    id: string,
    businessId: string,
    taxYear: string
  ): Promise<SeCumulativeSummaryResponse> {
    const res = await apiClient.get<{ data: SeCumulativeSummaryResponse }>(
      `/clients/${id}/businesses/${encodeURIComponent(businessId)}/cumulative/${encodeURIComponent(taxYear)}`
    )
    return res.data.data
  },

  async submitSeCumulative(
    id: string,
    businessId: string,
    taxYear: string,
    body: {
      periodDates: { periodStartDate: string; periodEndDate: string }
      periodIncome: { turnover: number; other: number }
      periodExpenses: { consolidatedExpenses: number }
    }
  ): Promise<SeCumulativeSummaryResponse> {
    const res = await apiClient.put<{ data: SeCumulativeSummaryResponse }>(
      `/clients/${id}/businesses/${encodeURIComponent(businessId)}/cumulative/${encodeURIComponent(taxYear)}`,
      body,
      { timeout: 30000 }
    )
    return res.data.data
  },

  async getUkPropertyCumulative(
    id: string,
    businessId: string,
    taxYear: string
  ): Promise<UkPropertyCumulativeSummaryResponse> {
    const res = await apiClient.get<{ data: UkPropertyCumulativeSummaryResponse }>(
      `/clients/${id}/businesses/${encodeURIComponent(businessId)}/property-cumulative/${encodeURIComponent(taxYear)}`
    )
    return res.data.data
  },

  async submitUkPropertyCumulative(
    id: string,
    businessId: string,
    taxYear: string,
    body: {
      fromDate: string
      toDate: string
      periodAmount: number
      consolidatedExpenses: number
    }
  ): Promise<UkPropertyCumulativeSummaryResponse> {
    const res = await apiClient.put<{ data: UkPropertyCumulativeSummaryResponse }>(
      `/clients/${id}/businesses/${encodeURIComponent(businessId)}/property-cumulative/${encodeURIComponent(taxYear)}`,
      body,
      { timeout: 30000 }
    )
    return res.data.data
  },

  /** Sandbox only — create a UK property income source on an authorised test client. */
  async createUkPropertyTestBusiness(id: string): Promise<BusinessListResponse> {
    const res = await apiClient.post<{ data: BusinessListResponse }>(
      `/clients/${id}/sandbox/uk-property-business`,
      {}
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

  async updateNote(
    clientId: string,
    noteId: string,
    patch: { text?: string; isPinned?: boolean }
  ): Promise<NoteRecord> {
    const res = await apiClient.patch<{ data: NoteRecord }>(
      `/clients/${clientId}/notes/${noteId}`,
      patch
    )
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

import apiClient from '@/lib/api/axiosClient'

export interface DeletionStatus {
  status: string
  executeAt: string
}

export interface ExportResult {
  /** Temporary blob URL — caller is responsible for revoking it after download. */
  blobUrl: string
  filename: string
}

const accountService = {
  /** Export all firm data as a ZIP. Returns a temporary blob URL for download. */
  async exportData(password: string): Promise<ExportResult> {
    const res = await apiClient.post<Blob>(
      '/account/data-export',
      { password },
      { responseType: 'blob' },
    )
    const today = new Date().toISOString().slice(0, 10)
    return {
      blobUrl: URL.createObjectURL(res.data),
      filename: `mytaxdiary-export-${today}.zip`,
    }
  },

  /** Get current pending deletion request, or null if none. */
  async getDeletionStatus(): Promise<DeletionStatus | null> {
    const res = await apiClient.get<{ data: DeletionStatus | null }>('/account/deletion-request')
    return res.data.data ?? null
  },

  /** Submit a deletion request. Returns the scheduled execution date. */
  async requestDeletion(password: string, mfaCode?: string): Promise<{ executeAt: string }> {
    const body: Record<string, string> = { password }
    if (mfaCode) body.mfaCode = mfaCode
    const res = await apiClient.post<{ data: { executeAt: string } }>('/account/deletion-request', body)
    return res.data.data
  },

  /** Cancel the current pending deletion request. */
  async cancelDeletion(): Promise<void> {
    await apiClient.delete('/account/deletion-request')
  },
}

export default accountService

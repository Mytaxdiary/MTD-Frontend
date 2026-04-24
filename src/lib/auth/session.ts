// Auth session helper
// TODO: Replace mock with real session logic (e.g. next-auth, JWT cookie decode, server-side session)

export interface User {
  id: string
  name: string
  email: string
  firmName: string
}

export interface Session {
  user: User
  isAuthenticated: boolean
}

/**
 * Returns the current session.
 * Currently returns a mock session so the app always loads.
 * TODO: Replace with real session retrieval when auth backend is ready.
 */
export async function getSession(): Promise<Session | null> {
  // TODO: Read from cookie / JWT / session store
  return {
    user: {
      id: 'mock-user-1',
      name: 'Jane Walker',
      email: 'jane@walkerandco.co.uk',
      firmName: 'Walker & Co Accountants',
    },
    isAuthenticated: true,
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session?.isAuthenticated ?? false
}

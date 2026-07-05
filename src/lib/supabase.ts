import { createClient } from '@supabase/supabase-js'

const isEnvConfigured = typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http') &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url' &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key';

// Helper to access / update mock DB tables
function getTable(name: string): any[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(`mock_db_${name}`)
    if (data) {
        try {
            return JSON.parse(data)
        } catch (e) {
            console.error('Failed to parse mock table:', name, e)
        }
    }

    // Default seed data
    let defaults: any[] = []
    if (name === 'internal_users') {
        defaults = [
            { id: '1', email: 'admin@doctorportal.com', is_active: true }
        ]
    } else if (name === 'qualifications') {
        defaults = [
            { id: 'q1', name: 'MBBS' },
            { id: 'q2', name: 'MD' },
            { id: 'q3', name: 'DO' },
            { id: 'q4', name: 'MS' }
        ]
    } else if (name === 'specializations') {
        defaults = [
            { id: 's1', name: 'Cardiology' },
            { id: 's2', name: 'Pediatrics' },
            { id: 's3', name: 'Dermatology' },
            { id: 's4', name: 'Orthopedics' },
            { id: 's5', name: 'General Medicine' }
        ]
    } else if (name === 'hospitals') {
        defaults = [
            { id: 'h1', name: 'City General Hospital', address: '123 Main St', city: 'Metropolis', state: 'NY', phone: '555-0199', email: 'info@citygeneral.com', is_active: true, created_at: new Date().toISOString() },
            { id: 'h2', name: 'St. Jude Children Hospital', address: '456 Care Ln', city: 'Gotham', state: 'NJ', phone: '555-0244', email: 'contact@stjude.org', is_active: true, created_at: new Date().toISOString() }
        ]
    } else if (name === 'doctors') {
        defaults = [
            { id: 'd1', name: 'Dr. Alice Smith', qualification_id: 'q2', experience_years: 12, consultation_fee: 150, hospital_id: 'h1', specialization_id: 's1', is_active: true, created_at: new Date().toISOString() },
            { id: 'd2', name: 'Dr. Bob Jones', qualification_id: 'q1', experience_years: 8, consultation_fee: 100, hospital_id: 'h2', specialization_id: 's2', is_active: true, created_at: new Date().toISOString() }
        ]
    }

    localStorage.setItem(`mock_db_${name}`, JSON.stringify(defaults))
    return defaults
}

function saveTable(name: string, data: any[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(`mock_db_${name}`, JSON.stringify(data))
}

class MockQueryBuilder {
    private tableName: string
    private filters: Array<(item: any) => boolean> = []
    private orderByField: string | null = null
    private orderByAscending = true
    private isSingle = false

    constructor(tableName: string) {
        this.tableName = tableName
    }

    select(columns: string = '*') {
        return this
    }

    eq(column: string, value: any) {
        this.filters.push((item) => item[column] === value)
        return this
    }

    neq(column: string, value: any) {
        this.filters.push((item) => item[column] !== value)
        return this
    }

    single() {
        this.isSingle = true
        return this
    }

    order(column: string, { ascending = true } = {}) {
        this.orderByField = column
        this.orderByAscending = ascending
        return this
    }

    // Promise and thenable compliance
    then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
        return this.execute().then(onfulfilled, onrejected)
    }

    private async execute() {
        let items = [...getTable(this.tableName)]

        // Apply filters
        for (const filter of this.filters) {
            items = items.filter(filter)
        }

        // Apply sorting
        if (this.orderByField) {
            items.sort((a, b) => {
                const valA = a[this.orderByField!]
                const valB = b[this.orderByField!]
                if (valA < valB) return this.orderByAscending ? -1 : 1
                if (valA > valB) return this.orderByAscending ? 1 : -1
                return 0
            })
        }

        // Resolve relations for 'doctors' table specifically
        if (this.tableName === 'doctors') {
            const hospitals = getTable('hospitals')
            const specializations = getTable('specializations')
            items = items.map((doctor) => {
                const h = hospitals.find((x) => x.id === doctor.hospital_id)
                const s = specializations.find((x) => x.id === doctor.specialization_id)
                return {
                    ...doctor,
                    hospitals: h ? { name: h.name } : null,
                    specializations: s ? { name: s.name } : null
                }
            })
        }

        if (this.isSingle) {
            return {
                data: items[0] || null,
                error: items.length ? null : { message: 'Row not found' }
            }
        }

        return { data: items, error: null }
    }

    async insert(data: any | any[]) {
        const items = getTable(this.tableName)
        const rowsToInsert = Array.isArray(data) ? data : [data]
        const insertedRows = rowsToInsert.map((row) => ({
            id: Math.random().toString(36).substring(2, 9),
            created_at: new Date().toISOString(),
            ...row
        }))
        const updatedItems = [...items, ...insertedRows]
        saveTable(this.tableName, updatedItems)
        return {
            data: Array.isArray(data) ? insertedRows : insertedRows[0],
            error: null
        }
    }

    async update(data: any) {
        const items = getTable(this.tableName)
        let updatedCount = 0
        const updatedItems = items.map((item) => {
            let matches = true
            for (const filter of this.filters) {
                if (!filter(item)) {
                    matches = false
                    break
                }
            }
            if (matches) {
                updatedCount++
                return { ...item, ...data }
            }
            return item
        })
        saveTable(this.tableName, updatedItems)
        return { data: null, error: null }
    }

    async delete() {
        const items = getTable(this.tableName)
        const keptItems = items.filter((item) => {
            let matches = true
            for (const filter of this.filters) {
                if (!filter(item)) {
                    matches = false
                    break
                }
            }
            return !matches
        })
        saveTable(this.tableName, keptItems)
        return { data: null, error: null }
    }
}

const mockAuth = {
    signInWithPassword: async ({ email }: any) => {
        const users = getTable('internal_users')
        const user = users.find((u) => u.email === email && u.is_active)
        if (user) {
            return {
                data: {
                    user: {
                        id: user.id,
                        email: user.email
                    }
                },
                error: null
            }
        }
        return {
            data: { user: null },
            error: { message: 'Invalid credentials or inactive portal user.' }
        }
    },
    signOut: async () => {
        return { error: null }
    }
}

export const supabase = isEnvConfigured
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    : ({
        from: (tableName: string) => new MockQueryBuilder(tableName),
        auth: mockAuth
    } as any)
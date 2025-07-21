export interface Account {
    accountId: string,
    nickname: string
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}
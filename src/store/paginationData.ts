//这里尝试用zustand来实现分页数据的存储

import { createStore } from 'zustand'
import { combine, devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type PaginationData<T> = {
    data: T[]
    page?: number //当前页,从0开始,加载的时候使用+1的值去请求数据，加载成功后实际更新值+1
    pageSize?: number
    total?: number
    isLoading?: boolean
    hasMore?: boolean
    hasError?: boolean
    _retry?: number
}

const defaultPaginationData: PaginationData<any> = {
    data: [],
    page: 0,
    pageSize: 10,
    total: 0,
    isLoading: false,
    hasMore: true,
    hasError: false,
    _retry: 0
}

export type PaginationDataResponse<T> = Promise<{
    data: T[]
    total?: number
} | {
    error: Error
}>
export type PaginationDataActions = {
    fetchMore: () => void
    fetch: (page: number, pageSize: number) => void
}

export type usePaginationDataOptions<T> = {
    initState?: Partial<PaginationData<T>>
    request: (page: number, pageSize: number) => PaginationDataResponse<T>
    maxRetry?: number
    retryDelay?: number
}

/**
 * 用zustand来实现分页数据的存储
 * 注意这里采用了createStore来创建store，而不是create来创建hooks。因为存在传参数,即是一种闭包调用的情况。
 * 如果直接采用create来创建hooks，那么每次调用createPaginationDataStore的时候都会创建一个新的hooks，这样会导致store的重复创建，无法保证store的唯一性
 * @param options 
 * @returns 
 */
export const createPaginationDataStore = <T = unknown>(options: usePaginationDataOptions<T>) => {
    return createStore(
        subscribeWithSelector(
            devtools(
                immer(
                    combine<PaginationData<T>, PaginationDataActions>(
                        { ...defaultPaginationData, ...(options.initState || {}) },
                        (set, get) => {
                            const _fetch = async (page, pageSize) => {
                                set({ isLoading: true })
                                try {
                                    const res = await options.request(page, pageSize)
                                    if ('data' in res) {
                                        set((state) => {
                                            state.data.push(...res.data)
                                            state.total = res.total || state.total
                                            state.page = page //请求成功,并且确实有数据的时候page值才更新+1
                                            state.isLoading = false
                                            state.hasMore = res.data.length >= pageSize && (res.total === undefined || res.total > state.data.length)
                                            state.hasError = false
                                            state._retry = 0

                                            return state
                                        }
                                        )
                                    } else {
                                        throw new Error('no data in response')
                                    }
                                } catch (error) {
                                    console.error(error);
                                    set({
                                        isLoading: false,
                                        hasMore: true,
                                        hasError: true,
                                        _retry: get()._retry + 1
                                    })
                                    //retry fetch while _retry < maxRetry
                                    if (get()._retry < (options.maxRetry || 3)) {
                                        setTimeout(() => {
                                            _fetch(page, pageSize)
                                        }, options.retryDelay || 1000)
                                    }
                                }
                            }
                            return ({
                                fetchMore: () => {
                                    if (get().isLoading || !get().hasMore) return
                                    _fetch(get().page + 1, get().pageSize)
                                },
                                fetch: _fetch
                            })
                        }
                    )
                )
            )
        )
    )
}

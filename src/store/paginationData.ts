import { Atom, atom, useAtom } from "jotai"
import { CustomStore, useCustomStore } from "./useCustomStore"
import { useEffect } from "react"


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

const paginationDataAtom = atom<PaginationData<any>>({
    data: [],
    page: 0,
    pageSize: 10,
    total: 0,
    isLoading: false,
    hasMore: true,
    hasError: false,
    _retry: 0
})

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
    storeKey?: string
}

/**
 * 这里通过usePaginationDataStore来创建了一个分页数据管理的自定义store
 * @param options 这里提供了一些配置参数，包括初始状态，请求方法，最大重试次数，重试间隔时间，store的key也在这里传入
 * @returns 这里返回了一个包含了分页数据和actions的载体，以及store本身
 */
export const usePaginationDataStore = <T = unknown>(options: usePaginationDataOptions<T>): [
    PaginationData<T>,
    PaginationDataActions,
    CustomStore
] => {
    const store = useCustomStore<{ paginationData: Atom<PaginationData<T>> }, PaginationDataActions>(
        (store) => [
            { paginationData: paginationDataAtom },
            (store) => {
                const _fetch = async (page, pageSize) => {
                    store.set(paginationDataAtom, (state) => {
                        return { ...state, isLoading: true }
                    })
                    try {
                        const res = await options.request(page, pageSize)
                        if ('data' in res) {
                            store.set(paginationDataAtom, (state) => {
                                state.data.push(...res.data)
                                state.total = res.total || state.total
                                state.page = page //请求成功,并且确实有数据的时候page值才更新+1
                                state.isLoading = false
                                state.hasMore = res.data.length >= pageSize && (res.total === undefined || res.total > state.data.length)
                                state.hasError = false
                                state._retry = 0

                                return { ...state }
                            }
                            )
                        } else {
                            throw new Error('no data in response')
                        }
                    } catch (error) {
                        console.error(error);
                        store.set(paginationDataAtom, (state) => ({
                            ...state,
                            isLoading: false,
                            hasMore: true,
                            hasError: true,
                            _retry: state._retry + 1
                        }))
                        //retry fetch while _retry < maxRetry
                        if (store.get(paginationDataAtom)._retry < (options.maxRetry || 3)) {
                            setTimeout(() => {
                                _fetch(page, pageSize)
                            }, options.retryDelay || 1000)
                        }
                    }
                }
                return ({
                    fetchMore: () => {
                        if (store.get(paginationDataAtom).isLoading || !store.get(paginationDataAtom).hasMore) return
                        _fetch(store.get(paginationDataAtom).page + 1, store.get(paginationDataAtom).pageSize)
                    },
                    fetch: _fetch
                })
            }
        ]
    )

    useEffect(() => {
        store.set(paginationDataAtom, (state) => ({ ...state, ...(options?.initState || {}) }))
    }, [options?.storeKey])

    const [usingAtom] = useAtom(paginationDataAtom)

    return [usingAtom, store.actions, store]
}

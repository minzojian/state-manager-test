import { faker } from '@faker-js/faker';


export type TestData = {
    id: string
    name: string
    gender: string
    avtar: string
}

const generateOneData: () => TestData = () => {
    return {
        id: faker.database.mongodbObjectId(),
        name: faker.person.fullName(),
        gender: faker.person.sex(),
        avtar: faker.image.avatar(),
    }

}

const total = 28
const maxDelay = 2000
export const mockPageDataRequest = (page: number, pageSize: number) => {
    const delay = Math.random() * maxDelay
    return new Promise<{ data: TestData[], total: number }>((resolve) => {
        setTimeout(() => {
            const data: TestData[] = []
            const start = Math.max(0, page - 1) * pageSize
            const end = Math.min(start + pageSize, total)
            for (let i = start; i < end; i++) {
                data.push(generateOneData())
            }
            resolve({ data, total })
        }, delay)
    })
}
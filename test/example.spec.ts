import {afterAll, beforeAll, beforeEach, describe, expect, it} from 'vitest'
import request from 'supertest'
import {app} from "../src/app";
import {execSync} from "node:child_process";

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run rollback --all')
        execSync('npm run migrate')
    })


    it('should be able to create a new transaction', async () => {
        const response = await request(app.server)
            .post('/transactions')
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            }).expect(201)
    })

    it('should be able to get all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })

        const cookies = createTransactionResponse.headers['set-cookie']

        const listResponseTransaction = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        expect(listResponseTransaction.body.transactions).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                title: "New Transaction",
                amount: 5000,
                created_at: expect.any(String),
                session_id: cookies[0].split(';')[0].split('=')[1]
            })
        ])
    })

    it('should be able to get a transaction by id', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })

        const cookies = createTransactionResponse.headers['set-cookie']

        const listResponseTransaction = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        const transactionId = listResponseTransaction.body.transactions[0].id

        const responseGetTransactionById = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(responseGetTransactionById.body.transaction).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                title: "New Transaction",
                amount: 5000,
                created_at: expect.any(String),
                session_id: cookies[0].split(';')[0].split('=')[1]
            })
        )
    })

    it('should be able to get the summary transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })

        const cookies = createTransactionResponse.headers['set-cookie']

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                title: "Debit Transaction",
                amount: 2000,
                type: "debit"
            })

        const summaryResponseTransaction = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200)

        expect(summaryResponseTransaction.body.summary).toEqual(
            expect.objectContaining({
                amount: 3000,
            })
        )
    })
})
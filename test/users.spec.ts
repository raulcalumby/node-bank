import { it, beforeAll, afterAll, describe, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })
      .expect(201)
  })

  it('should not be able to create a user with duplicate email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    }

    await request(app.server).post('/users').send(userData).expect(201)

    await request(app.server).post('/users').send(userData).expect(409)
  })

  it('should validate email format', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'invalid-email',
        password: '123456',
      })
      .expect(400)
  })

  it('should validate password minimum length', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
      })
      .expect(400)
  })
})

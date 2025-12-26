import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { hash } from 'bcrypt'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    try {
      const { name, email, password } = createUserBodySchema.parse(request.body)

      // Check if user already exists
      const existingUser = await knex('users').where('email', email).first()

      if (existingUser) {
        return reply.status(409).send({ error: 'User already exists' })
      }

      // Hash password before storing
      const hashedPassword = await hash(password, 10)

      await knex('users').insert({
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,
      })

      return reply.status(201).send()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }
      throw error
    }
  })
}

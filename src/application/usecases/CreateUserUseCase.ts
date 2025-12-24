import { injectable, inject } from 'inversify'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import { User } from '../../domain/entities/User'
import { BadRequestException } from '../../app/errors/AppError'

// =============================================================================
// Use Case Example
// =============================================================================
//
// Use cases encapsulate a single business operation.
// They orchestrate domain entities and repositories.
//
// Benefits:
// - Single Responsibility: one use case = one business action
// - Testable: easy to mock dependencies
// - Reusable: can be called from different entry points (HTTP, CLI, etc.)
//
// =============================================================================

// ---------------------------------------------------------------------------
// Input/Output Types
// ---------------------------------------------------------------------------

export interface CreateUserInput {
	email: string
	name: string
}

export interface CreateUserOutput {
	user: User
}

// ---------------------------------------------------------------------------
// Use Case Implementation
// ---------------------------------------------------------------------------

@injectable()
export class CreateUserUseCase {
	constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

	async execute(input: CreateUserInput): Promise<CreateUserOutput> {
		// 1. Validate business rules
		const existingUser = await this.userRepository.findByEmail(input.email)
		if (existingUser) {
			throw new BadRequestException('User with this email already exists')
		}

		// 2. Create domain entity
		const user = User.create(input.email, input.name)

		// 3. Persist via repository
		await this.userRepository.save(user)

		// 4. Return result
		return { user }
	}
}

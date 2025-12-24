import { injectable, inject } from 'inversify'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import type { User } from '../../domain/entities/User'
import { NotFoundException } from '../../app/errors/AppError'

// =============================================================================
// Get User By ID Use Case
// =============================================================================

export interface GetUserByIdInput {
	id: string
}

export interface GetUserByIdOutput {
	user: User
}

@injectable()
export class GetUserByIdUseCase {
	constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

	async execute(input: GetUserByIdInput): Promise<GetUserByIdOutput> {
		const user = await this.userRepository.findById(input.id)

		if (!user) {
			throw new NotFoundException(`User with ID ${input.id} not found`)
		}

		return { user }
	}
}

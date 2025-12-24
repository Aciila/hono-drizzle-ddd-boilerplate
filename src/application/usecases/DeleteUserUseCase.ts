import { injectable, inject } from 'inversify'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import { NotFoundException } from '../../app/errors/AppError'

// =============================================================================
// Delete User Use Case
// =============================================================================

export interface DeleteUserInput {
	id: string
}

@injectable()
export class DeleteUserUseCase {
	constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

	async execute(input: DeleteUserInput): Promise<void> {
		const user = await this.userRepository.findById(input.id)
		if (!user) {
			throw new NotFoundException(`User with ID ${input.id} not found`)
		}

		await this.userRepository.delete(input.id)
	}
}

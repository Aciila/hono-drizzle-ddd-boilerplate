import { injectable, inject } from 'inversify'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import type { User } from '../../domain/entities/User'
import { NotFoundException, BadRequestException } from '../../app/errors/AppError'

// =============================================================================
// Update User Use Case
// =============================================================================

export interface UpdateUserInput {
	id: string
	email?: string
	name?: string
}

export interface UpdateUserOutput {
	user: User
}

@injectable()
export class UpdateUserUseCase {
	constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

	async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
		const { id, ...updateData } = input

		// 1. Check if user exists
		const existingUser = await this.userRepository.findById(id)
		if (!existingUser) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		// 2. Check email uniqueness if updating email
		if (updateData.email && updateData.email !== existingUser.email) {
			const emailTaken = await this.userRepository.findByEmail(updateData.email)
			if (emailTaken) {
				throw new BadRequestException('Email is already taken')
			}
		}

		// 3. Update user
		const user = await this.userRepository.update(id, updateData)
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		return { user }
	}
}

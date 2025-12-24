import { injectable, inject } from 'inversify'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import type { User } from '../../domain/entities/User'

// =============================================================================
// List Users Use Case
// =============================================================================

export interface ListUsersInput {
	limit: number
	offset: number
}

export interface ListUsersOutput {
	users: User[]
	total: number
	limit: number
	offset: number
}

@injectable()
export class ListUsersUseCase {
	constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

	async execute(input: ListUsersInput): Promise<ListUsersOutput> {
		const result = await this.userRepository.findAll(input.limit, input.offset)

		return {
			users: result.rows,
			total: result.count,
			limit: input.limit,
			offset: input.offset,
		}
	}
}

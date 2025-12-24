// =============================================================================
// Application Enums
// =============================================================================

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum ErrorType {
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  NOT_FOUND = "not_found",
  INTERNAL = "internal",
}

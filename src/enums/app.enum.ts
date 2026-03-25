/**
 * User role enum
 */
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  STAFF = 'staff'
}

/**
 * OAuth provider enum
 */
export enum OAuthProvider {
  GOOGLE = 'google',
  GITHUB = 'github'
}

/**
 * Product status enum
 */
export enum ProductStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

export enum AttributeType {
  COLOR = 'COLOR',
  SIZE = 'SIZE',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN'
}

export enum CollectionType {
  MANUAL = 'MANUAL',
  CATEGORY_BASED = 'CATEGORY_BASED'
}

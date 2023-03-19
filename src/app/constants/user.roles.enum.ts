enum UserRoles {
  ADMIN = "Admin",
  MODERATOR = "Moderator",
  USER = "User",
  GUEST = "Guest"

}

/**
 * LevelZero
 * all logged in users
 */

export const LevelZero: UserRoles[] = [...Object.values(UserRoles)];

/**
 * LevelOne
 * ADMIN, MODERATOR, USER
 */
export const LevelOne: UserRoles[] = [UserRoles.ADMIN, UserRoles.MODERATOR, UserRoles.USER];

/**
 * LevelTwo
 * ADMIN, MODERATOR
 */
export const LevelTwo: UserRoles[] = [UserRoles.ADMIN, UserRoles.MODERATOR];

/**
 * LevelThere
 * ADMIN
 */
export const LevelThere: UserRoles[] = [UserRoles.ADMIN];

export default UserRoles;

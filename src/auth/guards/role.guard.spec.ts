import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../../role/dto/role.enum';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';
import { RolesGuard } from './role.guard';

const getUserMockWithRole = (roles: UserRoles[]) => {
  // On utilise un tableau d'une taille de 3 car c'est comme cela que le framework fonctionne en interne
  const user: Partial<User> = {
    roles: roles.map((r) => {
      const role = new Role();
      role.level = r;
      return role;
    }),
  };
  return Array(3).fill({
    req: {
      user: user,
    },
  });
};

const getExecutionContextWithUser = (...role: UserRoles[]) => {
  const executionContext = createMock<ExecutionContext>();
  executionContext.getArgs.mockReturnValue(getUserMockWithRole(role));
  return executionContext;
};

describe('RoleGuard', () => {
  let roleGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    roleGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect('RoleGuard').toBeDefined();
  });

  describe('when required role is User', () => {
    beforeEach(() => {
      // Required roles
      reflector.getAllAndOverride = jest.fn().mockReturnValue([UserRoles.User]);
    });

    it('then return TRUE if user role equal to User', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.User);

      expect(roleGuard.canActivate(executionContext)).toBe(true);
    });

    it('then return TRUE if user role equal to Moderator', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.Moderator);

      expect(roleGuard.canActivate(executionContext)).toBe(true);
    });

    it('then return TRUE if user role equal to Admin', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.Admin);

      expect(roleGuard.canActivate(executionContext)).toBe(true);
    });
  });

  describe('when required role is Moderator', () => {
    beforeEach(() => {
      // Required roles
      reflector.getAllAndOverride = jest
        .fn()
        .mockReturnValue([UserRoles.Moderator]);
    });

    it('then return FALSE if user role equal to User', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.User);

      expect(roleGuard.canActivate(executionContext)).toBe(false);
    });

    it('then return TRUE if user role equal to Moderator', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.Moderator);

      expect(roleGuard.canActivate(executionContext)).toBe(true);
    });

    it('then return TRUE if user role equal to Admin', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.Admin);

      expect(roleGuard.canActivate(executionContext)).toBe(true);
    });
  });

  describe('when required role is Admin', () => {
    beforeEach(() => {
      // Required roles
      reflector.getAllAndOverride = jest
        .fn()
        .mockReturnValue([UserRoles.Admin]);
    });

    it('then return FALSE if user role equal to User', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.User);

      expect(roleGuard.canActivate(executionContext)).toBe(false);
    });

    it('then return FALSE if user role equal to Moderator', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.Moderator);

      expect(roleGuard.canActivate(executionContext)).toBe(false);
    });

    it('then return TRUE if user role equal to Admin', () => {
      const executionContext = getExecutionContextWithUser(UserRoles.Admin);

      expect(roleGuard.canActivate(executionContext)).toBe(true);
    });
  });
});

'use strict';

module.exports = {
  async register(ctx) {
    try {
      const { username, email, password, role = 'customerProfile' } = ctx.request.body;

      if (!username || !email || !password) {
        return ctx.badRequest('Missing parameters');
      }

      // Check for existing user
      const userExists = await prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });

      if (userExists) {
        return ctx.badRequest('User already exists');
      }

      // Get default role if not specified
      const roleEntity = await prisma.role.findFirst({
        where: { type: role },
      });

      if (!roleEntity) {
        return ctx.badRequest('Invalid role');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await prisma.user.create({
        data: {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashedPassword,
          roleId: roleEntity.id,
          confirmed: true,
          provider: 'local',
        },
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      // Sanitize user data
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role,
      };

      return ctx.send({
        jwt: token,
        user: sanitizedUser,
      });
    } catch (err) {
      console.error('Registration error:', err);
      ctx.throw(500, err);
    }
  },
};
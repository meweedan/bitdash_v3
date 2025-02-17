// backend/src/api/auth/controllers/auth.js
'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async register(ctx) {
    const { username, email, password, userType = 'customerProfile' } = ctx.request.body;

    try {
      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() }
          ],
        },
      });

      if (existingUser) {
        return ctx.badRequest('Email or username already exists');
      }

      // Get the default role (authenticated)
      const defaultRole = await prisma.role.findFirst({
        where: { type: 'authenticated' },
      });

      if (!defaultRole) {
        return ctx.badRequest('Default role not found');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await prisma.user.create({
        data: {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashedPassword,
          roleId: defaultRole.id,
          userType,
          confirmed: true,
          provider: 'local',
        },
      });

      // Generate JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      // Sanitize user data
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      };

      return ctx.send({
        jwt: token,
        user: sanitizedUser,
      });
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest('Please provide identifier and password');
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier.toLowerCase() },
            { username: identifier.toLowerCase() },
          ],
        },
        include: {
          role: true,
          restaurant: true,
          menus: true,
        },
      });

      if (!user) {
        return ctx.badRequest('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return ctx.badRequest('Invalid credentials');
      }

      if (user.blocked) {
        return ctx.badRequest('Your account has been blocked');
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      // Sanitize user data
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        restaurant: user.restaurant ? {
          id: user.restaurant.id,
          name: user.restaurant.name,
        } : null,
        menus: user.menus.map(menu => ({
          id: menu.id,
          name: menu.name,
        })),
      };

      return ctx.send({
        jwt: token,
        user: sanitizedUser,
      });
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },
};

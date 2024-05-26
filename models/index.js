import mongoose from 'mongoose';
import user from './user.js';
import role from './role.js';
import File from './file.js';

mongoose.Promise = global.Promise;

 const db = {
  mongoose,
  user,
  role,
  File,
  ROLES: ['user', 'admin', 'moderator'],
};

export default db;
use("renature");

db.users.createIndex({ email: 1 }, { unique: true });
db.achievements.createIndex({ title: 1 }, { unique: true });
db.achievements.createIndex({ code: 1 }, { unique: true });
db.actions.createIndex({ user: 1, createdAt: -1 });

/**
 * Lightweight in-memory session manager for wizard steps and booking flow
 */

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  get(userId) {
    const id = Number(userId);
    return this.sessions.get(id) || {};
  }

  set(userId, data) {
    const id = Number(userId);
    const existing = this.sessions.get(id) || {};
    this.sessions.set(id, { ...existing, ...data, updatedAt: Date.now() });
  }

  clear(userId) {
    const id = Number(userId);
    this.sessions.delete(id);
  }

  clearStep(userId) {
    const id = Number(userId);
    const existing = this.sessions.get(id) || {};
    delete existing.step;
    this.sessions.set(id, existing);
  }
}

const sessionManager = new SessionManager();
module.exports = sessionManager;

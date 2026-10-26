/**
 * Atomic JSON Storage Engine with In-Memory Cache
 * Safe against crashes, zero native build dependencies
 */

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const DATA_DIR = path.resolve(__dirname, '../../data');

class StorageEngine {
  constructor() {
    this.ensureDataDir();
    this.cache = {
      users: [],
      events: [],
      venues: [],
      tickets: [],
      orders: [],
      promos: []
    };
    this.loadAll();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  getFilePath(collection) {
    return path.join(DATA_DIR, `${collection}.json`);
  }

  loadAll() {
    ['users', 'events', 'venues', 'tickets', 'orders', 'promos'].forEach(col => {
      const filePath = this.getFilePath(col);
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          this.cache[col] = JSON.parse(raw);
        } catch (err) {
          logger.error(`Error loading collection ${col}:`, err.message);
          this.cache[col] = [];
        }
      } else {
        this.cache[col] = [];
        this.persist(col);
      }
    });
    logger.info(`Storage engine loaded. Collections: ${Object.keys(this.cache).join(', ')}`);
  }

  persist(collection) {
    try {
      const filePath = this.getFilePath(collection);
      const data = JSON.stringify(this.cache[collection] || [], null, 2);
      fs.writeFileSync(filePath, data, 'utf-8');
    } catch (err) {
      logger.error(`Failed to persist collection ${collection}:`, err.message);
    }
  }

  // --- Users ---
  getUser(userId) {
    const id = Number(userId);
    return this.cache.users.find(u => u.id === id);
  }

  saveUser(userData) {
    const id = Number(userData.id);
    const index = this.cache.users.findIndex(u => u.id === id);
    const now = new Date().toISOString();

    if (index >= 0) {
      this.cache.users[index] = {
        ...this.cache.users[index],
        ...userData,
        last_active: now
      };
    } else {
      this.cache.users.push({
        id,
        username: userData.username || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        language: userData.language || 'uz',
        role: userData.role || 'user',
        created_at: now,
        last_active: now
      });
    }
    this.persist('users');
    return this.getUser(id);
  }

  getAllUsers() {
    return [...this.cache.users];
  }

  // --- Venues ---
  getVenues() {
    return [...this.cache.venues];
  }

  getVenueById(id) {
    return this.cache.venues.find(v => v.id === id);
  }

  saveVenue(venue) {
    const index = this.cache.venues.findIndex(v => v.id === venue.id);
    if (index >= 0) {
      this.cache.venues[index] = { ...this.cache.venues[index], ...venue };
    } else {
      this.cache.venues.push(venue);
    }
    this.persist('venues');
    return venue;
  }

  // --- Events ---
  getEvents(filter = {}) {
    let result = [...this.cache.events];
    if (filter.category) {
      result = result.filter(e => e.category === filter.category);
    }
    if (filter.venue_id) {
      result = result.filter(e => e.venue_id === filter.venue_id);
    }
    if (filter.active_only) {
      result = result.filter(e => e.is_active !== false);
    }
    return result;
  }

  getEventById(id) {
    return this.cache.events.find(e => e.id === id);
  }

  saveEvent(event) {
    const index = this.cache.events.findIndex(e => e.id === event.id);
    if (index >= 0) {
      this.cache.events[index] = { ...this.cache.events[index], ...event };
    } else {
      this.cache.events.push(event);
    }
    this.persist('events');
    return event;
  }

  deleteEvent(id) {
    this.cache.events = this.cache.events.filter(e => e.id !== id);
    this.persist('events');
  }

  // --- Promo Codes ---
  getPromo(code) {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    return this.cache.promos.find(p => p.code.toUpperCase() === clean && p.is_active);
  }

  savePromo(promo) {
    const index = this.cache.promos.findIndex(p => p.code.toUpperCase() === promo.code.toUpperCase());
    if (index >= 0) {
      this.cache.promos[index] = { ...this.cache.promos[index], ...promo };
    } else {
      this.cache.promos.push(promo);
    }
    this.persist('promos');
    return promo;
  }

  // --- Orders ---
  saveOrder(order) {
    const index = this.cache.orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      this.cache.orders[index] = { ...this.cache.orders[index], ...order };
    } else {
      this.cache.orders.push(order);
    }
    this.persist('orders');
    return order;
  }

  getOrderById(id) {
    return this.cache.orders.find(o => o.id === id);
  }

  getOrdersByUser(userId) {
    const id = Number(userId);
    return this.cache.orders.filter(o => o.user_id === id);
  }

  getAllOrders() {
    return [...this.cache.orders];
  }

  // --- Tickets ---
  saveTicket(ticket) {
    const index = this.cache.tickets.findIndex(t => t.id === ticket.id);
    if (index >= 0) {
      this.cache.tickets[index] = { ...this.cache.tickets[index], ...ticket };
    } else {
      this.cache.tickets.push(ticket);
    }
    this.persist('tickets');
    return ticket;
  }

  getTicketById(id) {
    return this.cache.tickets.find(t => t.id === id);
  }

  getTicketByCode(code) {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    return this.cache.tickets.find(t => t.ticket_code.toUpperCase() === clean);
  }

  getTicketsByUser(userId) {
    const id = Number(userId);
    return this.cache.tickets.filter(t => t.user_id === id);
  }

  getAllTickets() {
    return [...this.cache.tickets];
  }

  // Decrement sector seats safely
  bookSectorSeats(eventId, sectorName, count) {
    const event = this.getEventById(eventId);
    if (!event || !event.sectors) return false;

    const sector = event.sectors.find(s => s.name.toLowerCase() === sectorName.toLowerCase());
    if (!sector || sector.available_seats < count) return false;

    sector.available_seats -= count;
    this.saveEvent(event);
    return true;
  }

  // Restore sector seats on ticket cancellation
  restoreSectorSeats(eventId, sectorName, count) {
    const event = this.getEventById(eventId);
    if (!event || !event.sectors) return false;

    const sector = event.sectors.find(s => s.name.toLowerCase() === sectorName.toLowerCase());
    if (sector) {
      sector.available_seats = Math.min(sector.total_seats, sector.available_seats + count);
      this.saveEvent(event);
    }
    return true;
  }

  // Overall statistics for admin
  getStats() {
    const totalUsers = this.cache.users.length;
    const totalTickets = this.cache.tickets.filter(t => t.status !== 'CANCELLED').length;
    const totalOrders = this.cache.orders.length;
    const activeEvents = this.cache.events.filter(e => e.is_active !== false).length;
    const totalRevenue = this.cache.orders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    return {
      total_users: totalUsers,
      total_tickets: totalTickets,
      total_orders: totalOrders,
      active_events: activeEvents,
      total_revenue: totalRevenue
    };
  }
}

const storage = new StorageEngine();
module.exports = storage;

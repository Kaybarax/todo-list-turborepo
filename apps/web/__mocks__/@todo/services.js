// Mock for @todo/services
module.exports = {
  TodoApiClient: class {
    constructor() {}
    async getTodos() {
      return [];
    }
    async createTodo() {
      return {};
    }
    async updateTodo() {
      return {};
    }
    async deleteTodo() {
      return {};
    }
  },
  BlockchainService: class {
    constructor() {}
    async connect() {
      return true;
    }
    async disconnect() {
      return true;
    }
  },
};

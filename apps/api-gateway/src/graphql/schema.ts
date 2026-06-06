export const typeDefs = `
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    health: String
    todos: [Todo!]!
  }
`;

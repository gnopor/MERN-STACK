const { GraphQLServer } = require('graphql-yoga')
// ... or using `require()`
// import { GraphQLServer } from 'graphql-yoga'
const mongoose = require("mongoose");

// connect to the test db
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });

// define our model
const Todo = mongoose.model("Todo", {
  text: String,
  complete: Boolean
});

// handle requests; id is automaticaly added by mongoDB
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Mutation {
    createTodo(text: String!): Todo
    updateTodo(id: ID!, complete: Boolean!): Boolean
    removeTodo(id: ID!): Boolean
  }

`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      const todo = new Todo({ text, complete: false });
      await todo.save();
      return todo;
    },
    updateTodo: async (_, { id, complete }) => {
      await Todo.findByIdAndUpdate(id, { complete });
      return true;
    },
    removeTodo: async (_, { id }) => {
      await Todo.findByIdAndRemove(id);
      return true;
    }
  }
};

// connect to our servers
const server = new GraphQLServer({ typeDefs, resolvers }); // this server uses express as the backend server

mongoose.connection.once("open", function () {
  server.start(() => console.log('Server is running on localhost:4000'));
});
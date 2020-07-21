import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Close as CloseIcon } from "@material-ui/icons";
import {
  Paper,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  IconButton,
  Typography
}
  from "@material-ui/core";

import Form from "./components/Form";

// Graphql queries and mutation
const TodosQuery = gql`
{
  todos{
    id
    text
    complete
  }
}
`;
const UpdateMutation = gql`
mutation($id: ID!, $complete: Boolean!){
  updateTodo(id: $id, complete: $complete)
}
`;
const RemoveMutation = gql`
mutation($id: ID!){
  removeTodo(id: $id)
}
`;

const CreateTodoMutation = gql`
mutation($text: String!){
  createTodo(text: $text){
    id
    text
    complete
  }
  }
`;

// component
const App = () => {
  const response = useQuery(TodosQuery)
  const [updateTodo] = useMutation(UpdateMutation);
  const [removeTodo] = useMutation(RemoveMutation);
  const [createTodo] = useMutation(CreateTodoMutation);

  // handle fetch data
  if (response.data === undefined) { return null; }
  const { data: { todos } } = response;

  // update todo
  const handleUpdate = async (todo) => {
    await updateTodo({
      variables: { id: todo.id, complete: !todo.complete },
      update(cache) {
        const data = cache.readQuery({ query: TodosQuery });
        const result = data.todos.map(
          (x) => x.id === todo.id ? {
            ...todo,
            complete: !todo.complete
          } :
            x
        );
        cache.writeQuery({
          query: TodosQuery, data: {
            todos: [...result],
          },
        });
      }
    });
  }

  // remove todo
  const handleRemove = async (todo) => {
    await removeTodo({
      variables: { id: todo.id },
      update(cache) {
        const data = cache.readQuery({ query: TodosQuery });
        const result = data.todos.filter(x => x.id !== todo.id);
        cache.writeQuery({
          query: TodosQuery, data: {
            todos: [...result],
          },
        });
      }
    });
  }

  // create todo
  const handleCreate = async (text) => {
    await createTodo({
      variables: { text },
      update(cache, { data: { createTodo } }) {
        const data = cache.readQuery({ query: TodosQuery });
        const result = [createTodo, ...data.todos];
        //result.unshif(createTodo);
        cache.writeQuery({
          query: TodosQuery, data: {
            todos: [...result],
          },
        });
      }
    });
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ margin: "auto", width: 600 }}>
        <Typography variant="h6" gutterBottom>
          MERN TODO APP - Graphql
      </Typography>
        <Paper elevation={1}>
          <Form submit={handleCreate} />
          <List>
            {todos.map((todo) => (
              <ListItem key={todo.id} role={undefined} dense button onClick={() => handleUpdate(todo)}>
                <Checkbox
                  edge="start"
                  checked={todo.complete}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={todo.text} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleRemove(todo)}>
                    <CloseIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default App;

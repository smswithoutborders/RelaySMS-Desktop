import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const ListItems = ({ items }) => (
  <List>
    {items.map((item, index) => (
      <ListItem button key={index}>
        <ListItemText  primary={item.name} />
      </ListItem>
    ))}
  </List>
);

export default ListItems;

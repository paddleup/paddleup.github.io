// src/components/ui/List.tsx
import React from 'react';

export type ListProps = React.HTMLAttributes<HTMLUListElement>;
export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement>;

export const List = (props: ListProps) => <ul className="divide-y divide-border" {...props} />;

export const ListItem = (props: ListItemProps) => (
  <li className="flex items-center justify-between py-2" {...props} />
);

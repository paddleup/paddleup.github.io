import React from 'react';
import { cn } from '../../lib/utils';

/* List Container */
interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  divided?: boolean;
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ divided = false, className, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(divided && 'divide-y divide-border', className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);

List.displayName = 'List';

/* List Item */
const ListItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn('flex items-center justify-between py-3', className)}
        {...props}
      >
        {children}
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

export { List, ListItem };
export default List;
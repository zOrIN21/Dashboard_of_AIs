import type { SortOrder, StatusFilter as StatusFilterValue } from '../../types/run';
import type { StatusCounts } from '../../utils/runQuery';
import { SearchInput } from './SearchInput';
import { SortSelect } from './SortSelect';
import { StatusFilter } from './StatusFilter';
import styles from './RunsToolbar.module.css';

type RunsToolbarProps = {
  search: string;
  status: StatusFilterValue;
  sort: SortOrder;
  counts?: StatusCounts;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilterValue) => void;
  onSortChange: (value: SortOrder) => void;
};

export const RunsToolbar = ({
  search,
  status,
  sort,
  counts,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: RunsToolbarProps) => (
  <div className={styles.toolbar}>
    <div className={styles.row}>
      <SearchInput value={search} onChange={onSearchChange} />
      <SortSelect value={sort} onChange={onSortChange} />
    </div>
    <StatusFilter value={status} counts={counts} onChange={onStatusChange} />
  </div>
);

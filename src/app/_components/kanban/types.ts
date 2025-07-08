export interface Column {
	id: string;
	title: string;
}

export interface ColumnProps {
	column: Column;
	onDeleteColumn: (id: string) => void;
}

export interface Row {
	id: string;
	title: string;
	description: string;
}

export interface RowProps {
	row: Row;
	onDeleteRow: (id: string) => void;
}

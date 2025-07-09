export interface Column {
	id: string;
	title: string;
}

export interface ColumnProps {
	rows: Row[];
	column: Column;
	onDeleteColumn: (id: string) => void;
	onUpdateColumn: (id: string, title: string) => void;
	onAddRow: (columnId: string) => void;
	onDeleteRow: (id: string) => void;
	onUpdateRowTitle: (id: string, title: string) => void;
}

export interface Row {
	id: string;
	columnId: string;
	title: string;
	description: string;
}

export interface RowProps {
	row: Row;
	onDeleteRow: (id: string) => void;
	onUpdateRowTitle: (id: string, title: string) => void;
}

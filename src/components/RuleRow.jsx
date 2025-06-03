export default function RuleRow({ rule, onChange, onDelete }) {
  return (
    <div className="flex gap-2 items-center mb-2">
      <select
        onChange={(e) => onChange({ ...rule, field: e.target.value })}
        value={rule.field}
      >
        <option value="totalSpend">Total Spend</option>
        <option value="visits">Visits</option>
        <option value="lastActiveDays">Inactive (Days)</option>
      </select>
      <select
        onChange={(e) => onChange({ ...rule, operator: e.target.value })}
        value={rule.operator}
      >
        <option value=">">{">"}</option>
        <option value="<">{"<"}</option>
        <option value="=">{"="}</option>
      </select>
      <input
        type="number"
        value={rule.value}
        onChange={(e) => onChange({ ...rule, value: e.target.value })}
      />
      <button onClick={onDelete}>❌</button>
    </div>
  );
}

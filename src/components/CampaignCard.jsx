export default function CampaignCard({ campaign }) {
  const { createdAt, audience, segmentRules, messageTemplate, status } =
    campaign;

  return (
    <div className="campaign-card">
      <div className="campaign-header">
        <h3>{new Date(createdAt).toLocaleString()}</h3>
        <span className={`status-badge ${status ? "sent" : "failed"}`}>
          {status ? "✅ Sent" : "❌ Failed"}
        </span>
      </div>

      <div className="campaign-body">
        <p>
          <strong>Audience Size:</strong> {audience?.length || 0}
        </p>
        <p>
          <strong>Rules:</strong>{" "}
          {segmentRules?.rules
            .map((r) => `${r.field} ${r.operator} ${r.value}`)
            .join(` ${segmentRules?.logic || "AND"} `)}
        </p>
        <p>
          <strong>Message:</strong> {messageTemplate}
        </p>
      </div>
    </div>
  );
}

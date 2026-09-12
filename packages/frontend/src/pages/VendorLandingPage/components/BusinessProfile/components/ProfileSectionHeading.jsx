function ProfileSectionHeading({
  icon: Icon,
  title,
  description,
  compact = false,
  action,
}) {
  const headingClassName = [
    "vbp-section-heading",
    compact ? "vbp-section-heading-compact" : "",
    action ? "vbp-section-heading-with-action" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const headingContent = (
    <>
      <span className="vbp-section-icon">
        <Icon size={20} />
      </span>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </>
  );

  return (
    <div className={headingClassName}>
      {action ? <div className="vbp-heading-group">{headingContent}</div> : headingContent}
      {action}
    </div>
  );
}

export default ProfileSectionHeading;

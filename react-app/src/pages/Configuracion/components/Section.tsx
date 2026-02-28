import React from "react";

type SectionProps = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function Section(props: SectionProps) {
  return (
    <div className="cfgG-section">
      <div className="cfgG-sectionHeader">
        <div className="cfgG-sectionTitle">{props.title}</div>
        <div className="cfgG-actions">{props.actions}</div>
      </div>
      <div className="cfgG-sectionBody">{props.children}</div>
    </div>
  );
}

import React from "react";

type ActionBtnProps = {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
};

export default function ActionBtn(props: ActionBtnProps) {
  return (
    <button
      type="button"
      className="cfgG-btnIcon"
      title={props.title}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

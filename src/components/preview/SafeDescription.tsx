import React from "react";
import Markdown from "react-markdown";

interface SafeDescriptionProps {
  text?: string;
}

export const SafeDescription: React.FC<SafeDescriptionProps> = ({ text }) => {
  if (!text) return null;

  // Simple check to see if the text contains any HTML tags
  const hasHtml = /<[a-z][\s\S]*>/i.test(text);

  if (hasHtml) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  }

  return <Markdown>{text}</Markdown>;
};

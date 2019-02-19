import React from "react";
import { render, cancel } from "timeago.js";

export function TimeAgo({ date, locale = "en_US" }) {
  const ref = React.useRef();
  React.useEffect(() => {
    render(ref.current, locale);
    return () => {
      cancel(ref.current);
    };
  }, [date, locale]);

  return <span ref={ref} dateTime={date} />;
}

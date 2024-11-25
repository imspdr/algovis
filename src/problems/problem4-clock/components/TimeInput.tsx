import React, { useState } from "react";
import { TextField } from "@mui/material";

function TimeInput(props: { initTime: string; onComplete: (v: string) => void }) {
  const [time, setTime] = useState(props.initTime);
  const [error, setError] = useState(false);

  const timeRegex = /^(?:[01]?[0-9]|2[0-3])([0-5]?[0-9])([0-5]?[0-9])$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 6 && timeRegex.test(value)) {
      setTime(value);
      props.onComplete(value);
      setError(false);
    } else if (value.length === 6) {
      setError(true);
    } else {
      setTime(value);
      setError(false);
    }
  };

  return (
    <TextField
      value={time}
      onChange={handleChange}
      error={error}
      helperText={error ? "HHMMSS 포맷에 맞게 입력해주세요" : ""}
      type="text"
    />
  );
}

export default TimeInput;

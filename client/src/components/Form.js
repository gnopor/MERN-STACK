import React, { useState } from 'react';
import { TextField } from "@material-ui/core"

const Form = (props) => {
    const [text, setText] = useState('');

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            props.submit(text);
            setText('');
        }
    };

    return (
        <TextField
            label="Add a todo..."
            margin="normal"
            fullWidth
            value={text}
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => handleKeyDown(e)}
        />
    )
};

export default Form;
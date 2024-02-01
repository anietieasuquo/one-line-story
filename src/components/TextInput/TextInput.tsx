import React from 'react';
import { Form } from 'react-bootstrap';
import './TextInput.css';


const TextInput = ({ value, onChange, onSubmit, clearAfterSubmit, label, id, disabled }: { value: string; onChange: (content: string) => void; onSubmit?: (content: string) => void; clearAfterSubmit?: boolean; label: string; id: string; disabled?: boolean | false; }) => {
    const submitOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onSubmit && value.length > 0) {
            onSubmit(value);
            if (clearAfterSubmit) {
                onChange('');
            }
        }
    };

    return (
        <Form.Group className="form-group" aria-disabled={disabled}>
            <Form.Label htmlFor={id}>{label}:</Form.Label>
            <Form.Control id={id} type="text" value={value} onChange={e => onChange(e.target.value)} onKeyDown={submitOnEnter} disabled={disabled} />
        </Form.Group>
    );
};

export { TextInput };

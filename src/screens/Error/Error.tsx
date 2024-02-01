import './Error.css'

const Error = ({ title, message }: { title: string; message: string; }) => {
    return (
        <div className="error">
            <h2 className="text-danger">{title}</h2>
            <p>{message}</p>
        </div>
    );
};

export { Error };

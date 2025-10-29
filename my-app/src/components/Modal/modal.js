import "./modal.css";

function Modal({ item, onClose }) {
    if (!item) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">{item.name}</h2>
                <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ 
                        width: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain', 
                        borderRadius: '8px', 
                        margin: '15px 0' 
                    }} 
                />
                <p><strong>Brend:</strong> {item.brand}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <button className="modal-dialog-btn cancel-btn" onClick={onClose}>
                    Clothe
                </button>
            </div>
        </div>
    );
}

export default Modal;
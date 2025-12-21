import { useState, useEffect, useRef } from 'react'
import '../styles/components.css'

const SearchableDropdown = ({ options, value, onChange, label, placeholder = "Select or type..." }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState(value || '')
    const dropdownRef = useRef(null)

    useEffect(() => {
        setSearchTerm(value || '')
    }, [value])

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleInputChange = (e) => {
        const val = e.target.value
        setSearchTerm(val)
        onChange(val)
        setIsOpen(true)
    }

    const handleSelectOption = (option) => {
        setSearchTerm(option)
        onChange(option)
        setIsOpen(false)
    }

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            {label && <label className="form-label">{label}</label>}
            <div className="searchable-dropdown-container" style={{ position: 'relative' }}>
                <input
                    type="text"
                    className="form-input"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    style={{ paddingRight: '30px' }}
                />
                <i
                    className={`fas fa-chevron-down chevron ${isOpen ? 'rotate' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        transition: 'transform 0.2s'
                    }}
                ></i>

                {isOpen && (
                    <div className="custom-dropdown-menu open" style={{ width: '100%', maxHeight: '200px', overflowY: 'auto' }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`custom-dropdown-item ${searchTerm === option ? 'selected' : ''}`}
                                    onClick={() => handleSelectOption(option)}
                                >
                                    <span>{option}</span>
                                    {searchTerm === option && <i className="fas fa-check"></i>}
                                </div>
                            ))
                        ) : (
                            <div className="custom-dropdown-item" style={{ cursor: 'default', opacity: 0.7 }}>
                                <span>Create "{searchTerm}"</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchableDropdown

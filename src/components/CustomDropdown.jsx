import { useState, useEffect, useRef } from 'react'
import '../styles/components.css'

const CustomDropdown = ({ options, value, onChange, label, placeholder = "Select option" }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

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

    const handleSelect = (option) => {
        onChange(option.value)
        setIsOpen(false)
    }

    const selectedOption = options.find(opt => opt.value === value)

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            {label && <span className="custom-dropdown-label">{label}</span>}
            <div
                className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <i className={`fas fa-chevron-down chevron ${isOpen ? 'rotate' : ''}`}></i>
            </div>

            <div className={`custom-dropdown-menu ${isOpen ? 'open' : ''}`}>
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`custom-dropdown-item ${value === option.value ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                    >
                        <span>{option.label}</span>
                        {value === option.value && <i className="fas fa-check"></i>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomDropdown
